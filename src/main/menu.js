/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { Menu, app, dialog } = require('electron');
const { reload, restart, openBinFolder, openChangelog, openUrl, downloadPackages, downloadAIAssistant } = require('./helper');
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
            "label": 'Open File',
            click() {
                dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [
                        { name: 'All Files', extensions: ['*'] },
                        { name: 'Executables', extensions: ['exe', 'dll', 'sys'] },
                        { name: 'Archives', extensions: ['zip', 'rar', '7z'] }
                    ]
                }).then(result => {
                    if (!result.canceled && result.filePaths.length > 0) {
                        const filePath = result.filePaths[0];
                        // Switch to AI tab
                        launcher.webContents.send('switch-to-ai');
                        // Send file for analysis
                        setTimeout(() => {
                            launcher.webContents.send('ai-analyze-file', filePath);
                        }, 300);
                    }
                });
            }
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
            "label": 'Download AI assistant (beta)',
            click() { downloadAIAssistant(launcher); }
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
                    "label": 'Notice',
                    "accelerator": 'Ctrl+D',
                    click() {
                        launcher.webContents.send('open-notice');
                    }
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
