/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 2.0.0
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  click: (path) => {
    ipcRenderer.send('open-item', path);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (e, ...args) => func(...args));
  },
  off: (channel, func) => {
    ipcRenderer.off(channel, func);
  }
});
