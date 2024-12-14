/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.1
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { globalShortcut } = require('electron');

function registerShortcuts() {
	globalShortcut.register('CommandOrControl+W', () => { return; });
	globalShortcut.register('CommandOrControl+R', () => { return; });
}

module.exports = registerShortcuts;
