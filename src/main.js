/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

'use strict';

const { app, dialog } = require('electron');
const { setup, isWindows, getPath, formatUrl, openUrl, checkPackageStatus, startDownload } = require('./main/helper');
const createLauncher = require('./main/launcher');
const createSplash = require('./main/splash');
const createMenu = require('./main/menu');
const createTray = require('./main/tray');
const registerShortcuts = require('./main/shortcut');
const setupIpcListeners = require('./main/ipc.js');
const config = require('./config/app.json');

// Constants
const SPLASH_DURATION = 3000;
const STARTUP_CHECK_DELAY = 500;

let launcher = null;
let tray = null;

const locked = app.requestSingleInstanceLock();
if (!locked) {
    app.quit();

} else {
    app.on('second-instance', (e, cmd, dir) => {
        if (launcher) {
            if (launcher.isMinimized() && tray === undefined) {
                launcher.restore();
            }
            launcher.focus();
        }
    });
}

app.once('ready', () => {

    setup();

    if (isWindows()) {
        app.setAppUserModelId('ReVens');
    }

    registerShortcuts();

    const splash = createSplash();
    launcher = createLauncher();
    setupIpcListeners(launcher);
    createMenu(launcher);

    launcher.loadURL(formatUrl({
        pathname: getPath('main.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Check package status and send to launcher
    launcher.webContents.on('did-finish-load', () => {
        const status = checkPackageStatus();
        setTimeout(() => {
            launcher.webContents.send('package-status', status);
        }, STARTUP_CHECK_DELAY);
    });

    launcher.once('ready-to-show', () => {
        setTimeout(() => {
            splash.destroy();
            launcher.show();

            // Check package status after app is shown
            const status = checkPackageStatus();
            if (status.status === 'empty') {
                setTimeout(() => {
                    dialog.showMessageBox(launcher, {
                        type: 'question',
                        buttons: ['Download', 'Cancel'],
                        defaultId: 0,
                        title: 'No Packages Found',
                        message: 'No packages found, do you want to start downloading?'
                    }).then(result => {
                        if (result.response === 0) {
                            launcher.webContents.send('open-download');
                            startDownload(launcher);
                        }
                    });
                }, 500);
            }
        }, SPLASH_DURATION);
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

    if (config.debug) {
        launcher.webContents.openDevTools();
    }

});
