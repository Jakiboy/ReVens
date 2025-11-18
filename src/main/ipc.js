/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { ipcMain } = require('electron');
const { openItem, exploreItem, openUrl, abortDownload, startDownload, downloadSingleItem, abortItemDownload } = require('./helper');

let launcherInstance = null;

function setupIpcListeners(launcher) {
  launcherInstance = launcher;

  ipcMain.on('open-item', async (e, path) => {
    await openItem(path);
  });

  ipcMain.on('explore-item', async (e, path) => {
    await exploreItem(path);
  });

  ipcMain.on('open-url', (e, url) => {
    openUrl(url);
  });

  ipcMain.on('start-download', () => {
    if (launcherInstance) {
      startDownload(launcherInstance);
    }
  });

  ipcMain.on('abort-download', () => {
    abortDownload();
  });

  ipcMain.on('download-item', (e, item) => {
    if (launcherInstance) {
      downloadSingleItem(launcherInstance, item);
    }
  });

  ipcMain.on('abort-item-download', () => {
    abortItemDownload();
  });
}

module.exports = setupIpcListeners;
