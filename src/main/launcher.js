/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { BrowserWindow } = require('electron');
const { getPath } = require('./helper');
const config = require('../config/app.json');

function createLauncher() {

    const launcher = new BrowserWindow({
        title: 'ReVens - Reverse Engineering AIO',
        frame: true,
        width: config.width,
        height: config.height,
        minWidth: 600,
        minHeight: 640,
        opacity: 0.95,
        show: false,
        center: true,
        resizable: config.resizable,
        autoHideMenuBar: false,
        alwaysOnTop: false,
        useContentSize: false,
        fullscreen: false,
        skipTaskbar: false,
        closable: true,
        icon: getPath('./app/assets/img/icon-32.png'),
        webPreferences: {
            preload: getPath('./main/preload.js'),
            devTools: config.debug,
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    return launcher;
}

module.exports = createLauncher;
