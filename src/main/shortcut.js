/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.3.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { globalShortcut } = require('electron');

function registerShortcuts() {
	globalShortcut.register('CommandOrControl+W', () => { return; });
	globalShortcut.register('CommandOrControl+R', () => { return; });
}

module.exports = registerShortcuts;
