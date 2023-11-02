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
