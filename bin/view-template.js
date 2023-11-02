
const dashboard = `
    const extractStats = (items) => {
    const inititalStats = {
        updated: 0,
        patchUpdate: 0,
        minorUpdate: 0,
        majorUpdate: 0
    };
    return items.reduce((acc, item) => {
        switch (item.updateType) {
            case 'Updated':
                return {
                    ...acc,
                    updated: acc.updated + 1
                };
            case 'Patch update':
                return {
                    ...acc,
                    patchUpdate: acc.patchUpdate + 1
                };
            case 'Minor update':
                return {
                    ...acc,
                    minorUpdate: acc.minorUpdate + 1
                };
            case 'Major update':
                return {
                    ...acc,
                    majorUpdate: acc.majorUpdate + 1
                };
        }
    }, inititalStats);
};

const SUMMARY = {
    dependencies: extractStats(DEPENDENCIES),
    devDependencies: extractStats(DEV_DEPENDENCIES)
};

const buildPieChart = (
    { updated, patchUpdate, minorUpdate, majorUpdate },
    containerId,
    title
) => {
    var options = {
        title: {
            text: title
        },
        series: [updated, patchUpdate, minorUpdate, majorUpdate],
        labels: ['Updated', 'Patch update', 'Minor update', 'Major update'],
        chart: {
            type: 'donut'
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    var chart = new ApexCharts(document.querySelector(containerId), options);
    chart.render();
};

const fillDepChart = () => {
    buildPieChart(SUMMARY.dependencies, '#dep-chart', 'Dependencies');
};

const fillDevDepChart = () => {
    buildPieChart(
        SUMMARY.devDependencies,
        '#dev-dep-chart',
        'Dev Dependencies'
    );
};

const fillDepVsDevDepChart = () => {
    var options = {
        title: {
            text: 'Dependencies x Dev dependencies'
        },
        series: [
            {
                name: 'Dependencies',
                data: [
                    SUMMARY.dependencies.updated,
                    SUMMARY.dependencies.patchUpdate,
                    SUMMARY.dependencies.minorUpdate,
                    SUMMARY.dependencies.majorUpdate
                ]
            },
            {
                name: 'Dev Dependencies',
                data: [
                    SUMMARY.devDependencies.updated,
                    SUMMARY.devDependencies.patchUpdate,
                    SUMMARY.devDependencies.minorUpdate,
                    SUMMARY.devDependencies.majorUpdate
                ]
            }
        ],
        chart: {
            type: 'bar',
            height: 430
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        xaxis: {
            categories: [
                'Updated',
                'Patch update',
                'Minor update',
                'Major update'
            ]
        }
    };

    var chart = new ApexCharts(
        document.querySelector('#dep-vs-devdep-chart'),
        options
    );
    chart.render();
};

const setTableValue = (rowIndex, colIndex, value) => {
    document
        .querySelector(
            '#dashboard table tbody tr:nth-child(' +
                rowIndex +
                ') td:nth-child(' +
                colIndex +
                ')'
        )
        .append(value);
};

const fillDashboardTable = () => {
    const UPDATED_ROW_INDEX = 1;
    const PATCH_ROW_INDEX = 2;
    const MINOR_ROW_INDEX = 3;
    const MAJOR_ROW_INDEX = 4;
    const FOOTER_ROW_INDEX = 5;

    const DEP_COL_INDEX = 2;
    const DEV_DEP_COL_INDEX = 3;
    const TOTAL_DEP_COL_INDEX = 4;

    // Updating the dependencies values
    const depTotal =
        SUMMARY.dependencies.updated +
        SUMMARY.dependencies.patchUpdate +
        SUMMARY.dependencies.minorUpdate +
        SUMMARY.dependencies.majorUpdate;
    setTableValue(
        UPDATED_ROW_INDEX,
        DEP_COL_INDEX,
        SUMMARY.dependencies.updated
    );
    setTableValue(
        PATCH_ROW_INDEX,
        DEP_COL_INDEX,
        SUMMARY.dependencies.patchUpdate
    );
    setTableValue(
        MINOR_ROW_INDEX,
        DEP_COL_INDEX,
        SUMMARY.dependencies.minorUpdate
    );
    setTableValue(
        MAJOR_ROW_INDEX,
        DEP_COL_INDEX,
        SUMMARY.dependencies.majorUpdate
    );
    setTableValue(FOOTER_ROW_INDEX, DEP_COL_INDEX, depTotal);

    // Updating the dev dependencies values
    const devDepTotal =
        SUMMARY.devDependencies.updated +
        SUMMARY.devDependencies.patchUpdate +
        SUMMARY.devDependencies.minorUpdate +
        SUMMARY.devDependencies.majorUpdate;
    setTableValue(
        UPDATED_ROW_INDEX,
        DEV_DEP_COL_INDEX,
        SUMMARY.devDependencies.updated
    );
    setTableValue(
        PATCH_ROW_INDEX,
        DEV_DEP_COL_INDEX,
        SUMMARY.devDependencies.patchUpdate
    );
    setTableValue(
        MINOR_ROW_INDEX,
        DEV_DEP_COL_INDEX,
        SUMMARY.devDependencies.minorUpdate
    );
    setTableValue(
        MAJOR_ROW_INDEX,
        DEV_DEP_COL_INDEX,
        SUMMARY.devDependencies.majorUpdate
    );
    setTableValue(FOOTER_ROW_INDEX, DEV_DEP_COL_INDEX, devDepTotal);

    // Updating the totals values
    setTableValue(
        UPDATED_ROW_INDEX,
        TOTAL_DEP_COL_INDEX,
        SUMMARY.dependencies.updated + SUMMARY.devDependencies.updated
    );
    setTableValue(
        PATCH_ROW_INDEX,
        TOTAL_DEP_COL_INDEX,
        SUMMARY.dependencies.patchUpdate + SUMMARY.devDependencies.patchUpdate
    );
    setTableValue(
        MINOR_ROW_INDEX,
        TOTAL_DEP_COL_INDEX,
        SUMMARY.dependencies.minorUpdate + SUMMARY.devDependencies.minorUpdate
    );
    setTableValue(
        MAJOR_ROW_INDEX,
        TOTAL_DEP_COL_INDEX,
        SUMMARY.dependencies.majorUpdate + SUMMARY.devDependencies.majorUpdate
    );
    setTableValue(
        FOOTER_ROW_INDEX,
        TOTAL_DEP_COL_INDEX,
        devDepTotal + depTotal
    );
};

fillDepVsDevDepChart();
fillDepChart();
fillDevDepChart();
fillDashboardTable();

`;

const interactions = `
    const DASHBOARD_ID = 'dashboard';
const DEPENDENCIES_ID = 'dependencies';
const DEV_DEPENDENCIES_ID = 'dev-dependencies';

const dashboardMenu = document.getElementsByTagName('li').item(0);
const dependenciesMenu = document.getElementsByTagName('li').item(1);
const devDependenciesMenu = document.getElementsByTagName('li').item(2);

const selectNavItem = (selectedNavItem) => {
    const navItems = [dashboardMenu, dependenciesMenu, devDependenciesMenu];

    navItems.forEach((navItem) => {
        if (navItem !== selectedNavItem) {
            navItem.classList.remove('nav-active');
        }
    });
    selectedNavItem.classList.add('nav-active');
};

const showDashboardContent = () => {
    document.getElementById(DASHBOARD_ID).classList.add('active');
    document.getElementById(DEPENDENCIES_ID).classList.remove('active');
    document.getElementById(DEV_DEPENDENCIES_ID).classList.remove('active');
};

const showDependenciesContent = () => {
    document.getElementById(DASHBOARD_ID).classList.remove('active');
    document.getElementById(DEPENDENCIES_ID).classList.add('active');
    document.getElementById(DEV_DEPENDENCIES_ID).classList.remove('active');
};

const showDevDependenciesContent = () => {
    document.getElementById(DASHBOARD_ID).classList.remove('active');
    document.getElementById(DEPENDENCIES_ID).classList.remove('active');
    document.getElementById(DEV_DEPENDENCIES_ID).classList.add('active');
};

const populateTable = (tableBody, items) => {
    items.forEach((dependency) => {
        const row = document.createElement('tr');

        Object.values(dependency).forEach((cell) => {
            const cellElement = document.createElement('td');
            cellElement.append(cell);
            row.append(cellElement);
        });

        tableBody.append(row);
    });
};

// WHEN PAGE LOADS
populateTable(
    document.querySelector('#' + DEPENDENCIES_ID + ' table tbody'),
    DEPENDENCIES
);

populateTable(
    document.querySelector('#' + DEV_DEPENDENCIES_ID + ' table tbody'),
    DEV_DEPENDENCIES
);

dashboardMenu.addEventListener('click', () => {
    selectNavItem(dashboardMenu);
    showDashboardContent();
});

dependenciesMenu.addEventListener('click', () => {
    selectNavItem(dependenciesMenu);
    showDependenciesContent();
});

devDependenciesMenu.addEventListener('click', () => {
    selectNavItem(devDependenciesMenu);
    showDevDependenciesContent();
});

`;

const styles = `
    * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: sans-serif;
    color: #323232;

    --color-grey-100: #f3f3f3;
    --color-grey-200: #d5d5d5;
    --color-grey-500: #464646;
}

body {
    padding-bottom: 40px;
}

header {
    border-bottom: 1px solid #d5d5d5;
    font-size: 1rem;
    margin-bottom: 40px;
}

nav ul {
    display: flex;
    list-style: none;
    justify-content: center;
}

nav ul li {
    padding: 30px 20px;
    cursor: pointer;
}

nav ul li.nav-active {
    font-weight: 600;
    border-bottom: 2px solid #f77448;
}

main {
    padding: 0px 40px;
}

main > div {
    display: none;
    max-width: 1040px;
    margin: 0 auto;
}

main > div.active {
    display: block;
}

table {
    table-layout: fixed;
    width: 100%;
    height: 100%;
    border-spacing: 0;
    border-collapse: separate;
    border: 0;
}

table tbody {
    border: 1px solid var(--color-grey-200);
    border-radius: 8px;
    font-family: 'Proxima Nova', sans-serif;
    font-size: 14px;
}

table tbody tr:first-of-type > td:first-of-type {
    border-top-left-radius: 8px;
}

table tbody tr:first-of-type > td:last-of-type {
    border-top-right-radius: 8px;
}

table tbody tr:first-of-type > td {
    border-top: 1px solid var(--color-grey-200);
}

table tbody tr td:first-of-type {
    border-left: 1px solid var(--color-grey-200);
}

table tbody tr td:last-of-type {
    border-right: 1px solid var(--color-grey-200);
}

table tbody tr:last-of-type > td:first-of-type {
    border-bottom-left-radius: 8px;
}

table tbody tr:last-of-type > td:last-of-type {
    border-bottom-right-radius: 8px;
}

table tbody tr td {
    position: relative;
    border-bottom: 1px solid var(--color-grey-200);
    padding: 16px;
    word-break: break-word;
    hyphens: auto;
    background: none;
}

table thead tr {
    text-align: left;
}

table thead tr th {
    line-height: 20px;
    padding: 0 16px 8px 16px;
    background-color: unset;
    color: var(--color-grey-500);
    font-size: 0.9em;
    font-weight: 600;
    border: 0;
}

#dashboard {
    max-width: 2040px;
}

#dashboard table * {
    text-align: center;
}

#dashboard table tbody tr td:first-of-type {
    text-align: start;
}

#dashboard table thead tr th:first-of-type {
    text-align: start;
}

#dashboard table tbody tr:last-of-type {
    background-color: var(--color-grey-100);
    font-weight: 600;
}

.charts {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.card {
    border: 1px solid var(--color-grey-200);
    flex: 1;
}

`;

const index = `
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dependencies version analyser</title>

<style>${styles}</style>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

        <script>
            var DEPENDENCIES = {{dependencies}};
            var DEV_DEPENDENCIES = {{devDependencies}};
        </script>
    </head>
    <body>
        <header>
            <nav>
                <ul id="menu">
                    <li class="nav-active">Dashboard</li>
                    <li>Dependencies</li>
                    <li>Dev dependencies</li>
                </ul>
            </nav>
        </header>
        <main>
            <div id="dashboard" class="active">
                <div class="charts">
                    <div id="dep-vs-devdep-chart" class="card"></div>
                    <div id="dep-chart" class="card"></div>
                    <div id="dev-dep-chart" class="card"></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Update type</th>
                            <th>Dependencies</th>
                            <th>Dev dependencies</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Updated</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Patch update</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Minor update</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Major update</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="dependencies">
                <table>
                    <thead>
                        <tr>
                            <th>Dependency</th>
                            <th>Version</th>
                            <th>Latest version</th>
                            <th>Update type</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div id="dev-dependencies">
                <table>
                    <thead>
                        <tr>
                            <th>Dependency</th>
                            <th>Version</th>
                            <th>Latest version</th>
                            <th>Update type</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </main>
<script>${interactions}</script>
<script>${dashboard}</script>
    </body>
</html>

`;

exports.index = index;
