/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { ipcMain } = require('electron');
const { openItem, exploreItem, openUrl, abortDownload, startDownload, downloadSingleItem, abortItemDownload, abortAIDownload } = require('./helper');
const ai = require('./ai');

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

  ipcMain.on('abort-ai-download', () => {
    abortAIDownload();
  });

  ipcMain.handle('check-ai', async () => {
    const available = await ai.checkAvailability();
    return { available };
  });

  ipcMain.handle('query-ai', async (e, prompt, filePath = null) => {
    try {
      let response;
      if (filePath) {
        response = await ai.analyzeFile(filePath);
      } else {
        response = await ai.query(prompt);
      }
      return { success: true, response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.on('run-installer', (e, installerPath) => {
    const { shell } = require('electron');
    shell.openPath(installerPath);
  });
}

module.exports = setupIpcListeners;
