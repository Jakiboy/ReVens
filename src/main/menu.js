/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { Menu } = require('electron');
const { reload, openBinFolder, openInfo, openChangelog, openUrl } = require('./helper');

function createMenu(launcher) {
    const menu = Menu.buildFromTemplate(
        getTemplate(launcher)
    );
    Menu.setApplicationMenu(menu);
}

function getTemplate(launcher) {
    return [
        {
            "label": 'Tools',
            "submenu": [
                {
                    "label": 'Explore',
                    "accelerator": 'Ctrl+E',
                    click() { openBinFolder(); }
                },
                { "type": 'separator' },
                {
                    "label": 'Reload',
                    click() { reload(launcher); }
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
                    "accelerator": 'Ctrl+X',
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
