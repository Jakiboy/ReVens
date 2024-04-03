/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function openAbout(win, openURL) {
    let about = new BrowserWindow({
        parent: win,
        modal: true,
        height: 430,
        width: 500,
        show: false,
        resizable: false,
        autoHideMenuBar: true,
        minimizable: false,
        maximizable: false,
        icon: path.join(__dirname, '../app/assets/img/icon.png')
    });

    about.removeMenu();

    about.loadURL(url.format({
        pathname: path.join(__dirname, 'about.html'),
        protocol: 'file:',
        slashes: true
    }));

    about.webContents.on('dom-ready', () => {
        about.show();
    });

    about.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();
        openURL(url);
    });

    about.webContents.setWindowOpenHandler(({ url }) => {
        openURL(url);
        return { action: 'deny' }
    });
}

module.exports = openAbout;
