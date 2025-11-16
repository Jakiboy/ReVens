/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.3.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { Menu } = require('electron');
const { reload, openBinFolder, openInfo, openChangelog, openUrl } = require('./helper');
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
            "label": 'Search package',
            "accelerator": 'Ctrl+F',
            click() {
                launcher.webContents.send('open-search');
            }
        },
        { "type": 'separator' },
        {
            "label": 'Explore',
            "accelerator": 'Ctrl+E',
            click() { openBinFolder(); }
        }
    ];

    if (config.debug) {
        toolsSubmenu.push(
            { "type": 'separator' },
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
            "submenu": [
                {
                    "label": 'Settings',
                    "enabled": false,
                    "accelerator": 'Ctrl+S',
                    click() {
                        launcher.webContents.send('open-settings');
                    }
                }
            ]
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
                    click() { openUrl('https://github.com/Jakiboy/ReVens/releases'); }
                },
                { "type": 'separator' },
                {
                    "label": 'Report issue',
                    "accelerator": 'Ctrl+I',
                    click() { openUrl('https://github.com/Jakiboy/ReVens/issues'); }
                },
                {
                    "label": 'Edit packages',
                    click() { openUrl('https://github.com/Jakiboy/ReVens/pulls'); }
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
