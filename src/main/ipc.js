/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { ipcMain } = require('electron');
const { openItem, abortDownload, startDownload } = require('./helper');

let launcherInstance = null;

function setupIpcListeners(launcher) {
  launcherInstance = launcher;

  ipcMain.on('open-item', async (e, path) => {
    await openItem(path);
  });

  ipcMain.on('start-download', () => {
    if (launcherInstance) {
      startDownload(launcherInstance);
    }
  });

  ipcMain.on('abort-download', () => {
    abortDownload();
  });
}

module.exports = setupIpcListeners;
