/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.1
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { ipcMain } = require('electron');
const { openItem } = require('./helper');

function setupIpcListeners() {
  ipcMain.on('open-item', async (e, path) => {
    await openItem(path);
  });
}

module.exports = setupIpcListeners;
