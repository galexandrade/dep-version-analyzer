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

const renderCell = (content, row, wrapper) => {
    const cellElement = document.createElement('td');

    if (wrapper) {
        const wrapperElement = document.createElement(wrapper.tag);
        if (wrapper.classes) {
            wrapper.classes.forEach((className) =>
                wrapperElement.classList.add(className)
            );
        }
        wrapperElement.append(content);
        cellElement.append(wrapperElement);
    } else {
        cellElement.append(content);
    }
    row.append(cellElement);
};

const populateTable = (tableBody, items) => {
    tableBody.innerHTML = '';
    items.forEach((dependency) => {
        const row = document.createElement('tr');

        const { dependencyName, version, latestVersion, updateType } =
            dependency;

        row.addEventListener('click', () => {
            window.open(
                `https://www.npmjs.com/package/${dependencyName}`,
                '_blank'
            );
        });

        renderCell(dependencyName, row);
        renderCell(version, row);
        renderCell(latestVersion, row);

        const pillClasses = ['pill'];
        switch (updateType) {
            case 'Updated':
                pillClasses.push('pill--primary');
                break;
            case 'Patch update':
                pillClasses.push('pill--info');
                break;
            case 'Minor update':
                pillClasses.push('pill--warning');
                break;
            case 'Major update':
                pillClasses.push('pill--danger');
                break;
        }
        renderCell(updateType, row, { tag: 'div', classes: pillClasses });

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

const dependenciesFilter = document.getElementById('dependencies-filter');
dependenciesFilter.addEventListener('change', (e) => {
    const filteredItems = DEPENDENCIES.filter(
        (dep) => dep.updateType === e.target.value
    );
    populateTable(
        document.querySelector('#' + DEPENDENCIES_ID + ' table tbody'),
        e.target.value === 'All' ? DEPENDENCIES : filteredItems
    );
});

const devDependenciesFilter = document.getElementById(
    'dev-dependencies-filter'
);
devDependenciesFilter.addEventListener('change', (e) => {
    const filteredItems = DEV_DEPENDENCIES.filter(
        (dep) => dep.updateType === e.target.value
    );
    populateTable(
        document.querySelector('#' + DEV_DEPENDENCIES_ID + ' table tbody'),
        e.target.value === 'All' ? DEV_DEPENDENCIES : filteredItems
    );
});
