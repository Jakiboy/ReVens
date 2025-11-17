/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { BrowserWindow } = require('electron');
const { getPath, formatUrl } = require('./helper');
const path = require('path');

function createSplash() {

    const splash = new BrowserWindow({
        frame: false,
        width: 600,
        height: 400,
        maxWidth: 600,
        maxHeight: 400,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    splash.removeMenu();

    splash.loadURL(formatUrl({
        pathname: getPath('splash.html'),
        protocol: 'file:',
        slashes: true
    }));

    return splash;
}

module.exports = createSplash;
