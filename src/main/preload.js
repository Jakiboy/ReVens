/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  click: (path) => {
    ipcRenderer.send('open-item', path);
  },
  exploreItem: (path) => {
    ipcRenderer.send('explore-item', path);
  },
  openUrl: (url) => {
    ipcRenderer.send('open-url', url);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (e, ...args) => func(...args));
  },
  off: (channel, func) => {
    ipcRenderer.off(channel, func);
  },
  onPackageStatus: (callback) => {
    ipcRenderer.on('package-status', (e, status) => callback(status));
  },
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (e, data) => callback(data));
  },
  downloadPackages: () => {
    ipcRenderer.send('start-download');
  },
  abortDownload: () => {
    ipcRenderer.send('abort-download');
  },
  downloadItem: (item) => {
    ipcRenderer.send('download-item', item);
  },
  abortItemDownload: () => {
    ipcRenderer.send('abort-item-download');
  },
  onItemDownloadProgress: (callback) => {
    ipcRenderer.on('item-download-progress', (e, data) => callback(data));
  }
});
