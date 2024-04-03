/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function openDoc(win, openURL) {
    let doc = new BrowserWindow({
        parent: win,
        modal: true,
        height: 560,
        width: 600,
        show: false,
        resizable: false,
        autoHideMenuBar: true,
        minimizable: false,
        maximizable: false,
        icon: path.join(__dirname, '../app/assets/img/icon.png')
    });

    doc.removeMenu();

    doc.loadURL(url.format({
        pathname: path.join(__dirname, 'doc.html'),
        protocol: 'file:',
        slashes: true
    }));

    doc.webContents.on('dom-ready', () => {
        doc.show();
    });

    doc.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();
        openURL(url);
    });

    doc.webContents.setWindowOpenHandler(({ url }) => {
        openURL(url);
        return { action: 'deny' }
    });
}

module.exports = openDoc;