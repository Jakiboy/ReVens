/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

'use strict';

const { app } = require('electron');
const { setup, isWindows, getPath, formatUrl, openUrl } = require('./main/helper');
const createLauncher = require('./main/launcher');
const createSplash = require('./main/splash');
const createMenu = require('./main/menu');
const createTray = require('./main/tray');
const registerShortcuts = require('./main/shortcut');
const config = require('./config/app.json');

let launcher = null;
let tray = null;

const locked = app.requestSingleInstanceLock();
if ( !locked ) {
    app.quit();

} else {
    app.on('second-instance', (e, cmd, dir) => {
        if ( launcher ) {
            if (launcher.isMinimized() && tray === undefined) {
                launcher.restore();
            }
            launcher.focus();
        }
    });
}

app.once('ready', () => {

    setup();

    if ( isWindows() ) {
        app.setAppUserModelId('ReVens');
    }
    
    registerShortcuts();

    const splash = createSplash();
    launcher = createLauncher();
    createMenu(launcher);
    
    launcher.loadURL(formatUrl({
        pathname: getPath('main.html'),
        protocol: 'file:',
        slashes: true
    }));

    launcher.once('ready-to-show', () => {
        setTimeout(function () {
            splash.destroy();
            launcher.show();
        }, 3000);
    });

    launcher.on('minimize', (e) => {

        e.preventDefault();
        launcher.hide();

        tray = createTray(app);
        tray.on('click', () => {
            launcher.show();
            tray.destroy();
        });
        
    });

    launcher.webContents.on('will-navigate', (e, url) => {
		e.preventDefault();
		openUrl(url);
    });

    launcher.webContents.setWindowOpenHandler(({ url }) => {
		openUrl(url);
		return { action: 'deny' }
    });

    if ( config.debug ) {
        launcher.webContents.openDevTools();
    }
    
});
