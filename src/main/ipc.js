/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { ipcMain } = require('electron');

function setupIpcListeners() {
    ipcMain.on('button-click', (event, buttonId) => {
        console.log(`Button clicked: ${buttonId}`);
    });
}

module.exports = setupIpcListeners;
