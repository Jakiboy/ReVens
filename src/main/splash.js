/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.1
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { BrowserWindow } = require('electron');
const { getPath, formatUrl } = require('./helper');

function createSplash() {

    const splash = new BrowserWindow({
        frame: false,
        width: 600,
        height: 400,
        maxWidth: 600,
        maxHeight: 400,
        transparent: true,
        alwaysOnTop: true
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
