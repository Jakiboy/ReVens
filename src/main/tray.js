const { Tray, Menu } = require('electron');
const { getPath, openBinFolder } = require('./helper');

function createTray(app) {

    const tray = new Tray(getPath('./app/assets/img/icon.ico'));
    tray.setToolTip('ReVens');

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