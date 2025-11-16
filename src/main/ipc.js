/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.3.x
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
