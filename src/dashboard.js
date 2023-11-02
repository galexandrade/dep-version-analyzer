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
            type: 'bar'
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
