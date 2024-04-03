/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { ipcMain } = require('electron');

function setupIpcListeners() {
    ipcMain.on('some-event', (event, arg) => {
        console.log(arg);
        event.reply('some-event-reply', 'pong');
    });
}

module.exports = { setupIpcListeners };
