const fs = require('fs');
const path = require('path');

const getAllFiles = function (dirPath, arrayOfFiles) {
    const DIR_PATH = path.resolve(__dirname, '../') + '/';
    files = fs.readdirSync(DIR_PATH + dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const filePath = dirPath + '/' + file;
        if (filePath.includes('src/components')) {
            return;
        }
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(DIR_PATH, dirPath, '/', file));
        }
    });

    return arrayOfFiles;
};

const readIndexContent = async (file) => {
    const content = await new Promise((resolve) => {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file)
        });

        let content = '';
        let isInMockedDependenciesBlock = false;

        lineReader
            .on('line', async function (line) {
                if (line.includes('<script id="mock-dependencies">')) {
                    isInMockedDependenciesBlock = true;
                }
                if (isInMockedDependenciesBlock && line.includes('</script>')) {
                    isInMockedDependenciesBlock = false;
                    content =
                        content +
                        `
        <script>
            var DEPENDENCIES = {{dependencies}};
            var DEV_DEPENDENCIES = {{devDependencies}};
        </script>
`;
                    return;
                }
                if (!isInMockedDependenciesBlock) {
                    if (
                        line.includes(
                            '<link rel="stylesheet" href="./styles.css" />'
                        )
                    ) {
                        content = content + '<style>${styles}</style>' + '\n';
                    } else if (
                        line.includes(
                            '<script type="module" src="./interactions.js"></script>'
                        )
                    ) {
                        content =
                            content + '<script>${interactions}</script>' + '\n';
                    } else if (
                        line.includes(
                            '<script type="module" src="./dashboard.js"></script>'
                        )
                    ) {
                        content =
                            content + '<script>${dashboard}</script>' + '\n';
                    } else {
                        content = content + line + '\n';
                    }
                }
            })
            .on('close', () => {
                resolve(content);
            });
    });
    return content;
};

const readContent = async (file) => {
    if (file.includes('index.html')) {
        return readIndexContent(file);
    }
    const content = await new Promise((resolve) => {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file)
        });

        let content = '';

        lineReader
            .on('line', async function (line) {
                content = content + line + '\n';
            })
            .on('close', () => {
                resolve(content);
            });
    });
    return content;
};

const allFiles = getAllFiles('src');

// Sort the index.html file to be the last one in the array
const htmlFileIndex = allFiles.findIndex((file) => file.includes('index.html'));
const htmlFile = allFiles[htmlFileIndex];
allFiles.splice(htmlFileIndex, 1);
allFiles.push(htmlFile);

let templateContent = `
// IMPARTANT: This file is autogenerated using \`yarn build\`. Don't modify it manually!
`;

allFiles.forEach(async (filePath, index) => {
    const levels = filePath.split('/');
    const file = levels[levels.length - 1];
    const [fileName, extension] = file.split('.');
    const content = await readContent(filePath);

    templateContent =
        templateContent +
        `
const ${fileName} = \`
    ${content}
\`;
`;

    const isLast = index === allFiles.length - 1;
    if (isLast) {
        templateContent =
            templateContent +
            `
exports.index = index;
`;
        fs.writeFile('bin/view-template.js', templateContent, (err) => {
            if (err) {
                throw err;
            }
        });
        console.log('bin/view-template.js generated!');
    }
});
