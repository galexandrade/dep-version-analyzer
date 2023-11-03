#! /usr/bin/env node
const template = require('./view-template');
const axios = require('axios');
const open = require('open');

const createServer = ({ dependencies, devDependencies }) => {
    const http = require('http');

    const host = 'localhost';
    const port = 8000;

    const requestListener = function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);

        const pageContent = template.index
            .replace('{{dependencies}}', JSON.stringify(dependencies))
            .replace('{{devDependencies}}', JSON.stringify(devDependencies));

        res.end(pageContent);
    };

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
        open(`http://${host}:${port}`);
    });
};

function getLatestVersion(packageName) {
    return axios
        .get('https://registry.npmjs.org/' + packageName + '/latest')
        .then((res) => res.data);
}

const readPackageJsonFile = (callback) => {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('package.json')
    });
    var isInDependencyBlock = false;
    var isInDevDependencyBlock = false;
    const dependencies = [];
    const devDependencies = [];

    lineReader
        .on('line', async function (line) {
            if (!isInDependencyBlock && line.includes(`"dependencies": {`)) {
                isInDependencyBlock = true;
                return;
            }
            if (isInDependencyBlock && line.includes(`}`)) {
                isInDependencyBlock = false;
                return;
            }
            if (
                !isInDevDependencyBlock &&
                line.includes(`"devDependencies": {`)
            ) {
                isInDevDependencyBlock = true;
                return;
            }
            if (isInDevDependencyBlock && line.includes(`}`)) {
                isInDevDependencyBlock = false;
                return;
            }

            if (isInDependencyBlock) {
                const dependencyLine = line
                    .trim()
                    .replace(',', '')
                    .replaceAll(`"`, '');
                const [dependencyName, version] = dependencyLine.split(': ');
                dependencies.push({
                    dependencyName,
                    version
                });
            }

            if (isInDevDependencyBlock) {
                const dependencyLine = line
                    .trim()
                    .replace(',', '')
                    .replaceAll(`"`, '');
                const [dependencyName, version] = dependencyLine.split(': ');
                devDependencies.push({
                    dependencyName,
                    version
                });
            }
        })
        .on('close', () => {
            callback({ dependencies, devDependencies });
        });
};

const calculateUpdateType = (currentVersion, latestVersion) => {
    const [currentMajor, currentMinor, currentPatch] = currentVersion
        .replace('^', '')
        .split('.');
    const [latestMajor, latestMinor, latestPatch] = latestVersion.split('.');

    if (currentVersion.includes(latestVersion)) {
        return 'Updated';
    }

    if (currentMajor !== latestMajor) {
        return 'Major update';
    }

    if (currentMinor !== latestMinor) {
        return 'Minor update';
    }

    if (currentPatch !== latestPatch) {
        return 'Patch update';
    }

    return 'Unknown';
};

const getUpdatedVersions = async (dependencies) => {
    const dependenciesMap = {};
    const promisses = [];
    for (let index = 0; index < dependencies.length; index++) {
        const dependency = dependencies[index];

        let dependencyName = dependency.dependencyName;
        let dependencyVersion = dependency.version;

        if (dependency.version.includes('npm:')) {
            const fullDependencyLine = dependency.version.split('npm:')[1];
            if (fullDependencyLine[0] === '@') {
                dependencyName =
                    '@' + fullDependencyLine.replace('@', '').split('@')[0];
                dependencyVersion = fullDependencyLine
                    .replace('@', '')
                    .split('@')[1];
            } else {
                dependencyName = fullDependencyLine.split('@')[0];
                dependencyVersion = fullDependencyLine.split('@')[1];
            }
        }

        dependenciesMap[dependency.dependencyName] = {
            officialName: dependencyName,
            officialVersion: dependencyVersion
        };
        promisses.push(getLatestVersion(dependencyName));
    }
    const responses = await Promise.all(promisses);
    const responsesMap = responses.reduce((acc, response) => {
        return {
            ...acc,
            [response.name]: response
        };
    }, {});

    return dependencies.map((dependency) => {
        const officialDependency = dependenciesMap[dependency.dependencyName];
        const npmData = responsesMap[officialDependency.officialName];
        return {
            ...dependency,
            description: npmData.description,
            officialName: npmData.name,
            latestVersion: npmData.version,
            updateType: calculateUpdateType(
                officialDependency.officialVersion,
                npmData.version
            )
        };
    });
};

const readLatestVersions = async ({ dependencies, devDependencies }) => {
    const updatedDependencies = await getUpdatedVersions(dependencies);
    const updatedDevDependencies = await getUpdatedVersions(devDependencies);
    createServer({
        dependencies: updatedDependencies,
        devDependencies: updatedDevDependencies
    });
};

readPackageJsonFile(readLatestVersions);
