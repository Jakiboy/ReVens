/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { Menu, app } = require('electron');
const { reload, restart, openBinFolder, openInfo, openChangelog, openUrl, downloadPackages } = require('./helper');
const config = require('../config/app.json');

function createMenu(launcher) {
    const menu = Menu.buildFromTemplate(
        getTemplate(launcher)
    );
    Menu.setApplicationMenu(menu);
}

function getTemplate(launcher) {
    const toolsSubmenu = [
        {
            "label": 'Add file',
            "enabled": false,
            click() { }
        },
        {
            "label": 'Search packages',
            "accelerator": 'Ctrl+F',
            click() {
                launcher.webContents.send('open-search');
            }
        },
        {
            "label": 'Download packages',
            "accelerator": 'Ctrl+Shift+D',
            click() { downloadPackages(launcher); }
        },
        { "type": 'separator' },
        {
            "label": 'Explore',
            "accelerator": 'Ctrl+E',
            click() { openBinFolder(); }
        }
    ];

    const advancedSubmenu = [
        {
            "label": 'Settings',
            "enabled": false,
            "accelerator": 'Ctrl+S',
            click() {
                launcher.webContents.send('open-settings');
            }
        },
        { "type": 'separator' },
        {
            "label": 'Restart',
            "accelerator": 'Ctrl+R',
            click() { restart(app); }
        }
    ];

    if (config.debug) {
        advancedSubmenu.push(
            {
                "label": 'Reload',
                click() { reload(launcher); }
            }
        );
    }

    return [
        {
            "label": 'File',
            "submenu": toolsSubmenu
        },
        {
            "label": 'Advanced',
            "submenu": advancedSubmenu
        },
        {
            "label": 'Help',
            "submenu": [
                {
                    "label": 'Documentation',
                    "accelerator": 'Ctrl+D',
                    click() {
                        launcher.webContents.send('open-doc');
                    }
                },
                {
                    "label": 'Packages',
                    "accelerator": 'Ctrl+P',
                    click() { openInfo(); }
                },
                {
                    "label": 'Changelog',
                    "accelerator": 'Ctrl+Q',
                    click() { openChangelog(); }
                },
                { "type": 'separator' },
                {
                    "label": 'Update',
                    "accelerator": 'Ctrl+U',
                    click() { openUrl(`${config.url}/releases`); }
                },
                { "type": 'separator' },
                {
                    "label": 'Report issue',
                    "accelerator": 'Ctrl+I',
                    click() { openUrl(`${config.url}/issues`); }
                },
                {
                    "label": 'Edit packages',
                    click() { openUrl(`${config.url}/pulls`); }
                },
                { "type": 'separator' },
                {
                    "label": 'About',
                    "accelerator": 'Ctrl+A',
                    click() {
                        launcher.webContents.send('open-about');
                    }
                }
            ]
        }
    ];
}

module.exports = createMenu;
