/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { ipcMain } = require('electron');
const { openItem } = require('./helper');

function setupIpcListeners() {
  ipcMain.on('open-item', async (event, path) => {
    await openItem(path);
  });
}

module.exports = setupIpcListeners;
