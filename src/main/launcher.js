/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { BrowserWindow } = require('electron');
const { getPath } = require('./helper');

function createLauncher() {

    const launcher = new BrowserWindow({
        title: 'ReVens - Reverse Engineering AIO',
        frame: true,
        width: 1000,
        height: 720,
        opacity: 0.95,
        show: false,
        center: true,
        resizable: false,
        autoHideMenuBar: false,
        alwaysOnTop: false,
        useContentSize: false,
        fullscreen: false,
        skipTaskbar: false,
        closable: true,
        icon: getPath('./app/assets/img/icon.png'),
        webPreferences: {
            devTools: true,
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    return launcher;
}

module.exports = createLauncher;
