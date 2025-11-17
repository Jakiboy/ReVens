const { Tray, Menu } = require('electron');
const { getPath, openBinFolder } = require('./helper');
const appConfig = require('../config/app.json');

function createTray(app) {

    const tray = new Tray(getPath('./app/assets/img/blank.ico'));
    tray.setToolTip(appConfig.productName || appConfig.name);

    const context = Menu.buildFromTemplate(
        getTemplate(app)
    );
    tray.setContextMenu(context);

    return tray;
}

function getTemplate(app) {
    return [
        {
            "label": 'Explore',
            click() { openBinFolder(); }
        },
        { "type": 'separator' },
        {
            "label": 'Exit',
            click() { app.quit(); }
        }
    ]
}

module.exports = createTray;