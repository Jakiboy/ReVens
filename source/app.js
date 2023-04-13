/**
 * Author  : Jihad Sinnaour (Jakiboy)
 * package : ReVen | Reverse Engineering Toolkit AIO
 * version : 1.0.0
 */

'use strict';

/**
 * Electron init.
 */
const { app, shell, dialog, Menu, Tray, Notification, BrowserWindow, globalShortcut } = require('electron');

/**
 * Dependencies init.
 */
const Path = require('path');
const Url = require('url');
const Progress = require('electron-progressbar');
const Fs = require('fs');
const Axios = require('axios');

/**
 * Tray init.
 */
let tray = null;

/**
 * Progress bar init.
 */
let bar = null;

/**
 * Menu init.
 */
const template = [
	{
		"label": 'Tools',
		"submenu": [
			{
				"label": 'Explore',
				"accelerator": 'Ctrl+E',
				click() { openBinFolder(); }
			},
			{ "type": 'separator' },
			{
				"label": 'Download packages',
				click() { downloadPackages(); }
			},
			{ "type": 'separator' },
			{
				"label": 'Reload',
				click() { reload(); }
			}
		]
	},
	{
		"label": 'Help',
		"submenu": [
			{
				"label": 'Documentation',
				"accelerator": 'Ctrl+D',
				click() { openDoc(); }
			},
			{ "type": 'separator' },
			{
				"label": 'Update',
				"accelerator": 'Ctrl+U',
				click() { openURL('https://github.com/Jakiboy/ReVen/releases'); }
			}, ,
			{ "type": 'separator' },
			{
				"label": 'Report issue',
				"accelerator": 'Ctrl+I',
				click() { openURL('https://github.com/Jakiboy/ReVen/issues'); }
			},
			{ "type": 'separator' },
			{
				"label": 'About',
				"accelerator": 'Ctrl+A',
				click() { openAbout(); }
			}
		]
	}
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

/**
 * Window init (Single instance).
 */
let win = null;
const locked = app.requestSingleInstanceLock();
if (!locked) {
	app.quit();

} else {
	app.on('second-instance', (e, cmd, dir) => {
		if (win) {
			if (win.isMinimized() && tray === undefined) {
				win.restore();
			}
			win.focus();
		}
	});
}

/**
 * Ready.
 */
app.once('ready', () => {

	// Name
	if (process.platform === 'win32') {
		app.setAppUserModelId('ReVen');
	}

	// Shortcut
	globalShortcut.register('CommandOrControl+W', () => { return; });
	globalShortcut.register('CommandOrControl+R', () => { return; });

	// Setup Splash
	const splash = new BrowserWindow({
		"frame": false,
		"width": 600,
		"height": 400,
		"maxWidth": 600,
		"maxHeight": 400,
		"transparent": true,
		"alwaysOnTop": true
	});

	// Remove Splash menu
	splash.removeMenu();

	// Load Splash
	splash.loadURL(Url.format({
		"pathname": Path.join(__dirname, 'splash.html'),
		"protocol": 'file:',
		"slashes": true
	}));

	// Setup Main
	win = new BrowserWindow({
		"title": 'ReVen - Reverse Engineering AIO',
		"frame": true,
		"width": 1000,
		"height": 700,
		"opacity": 0.95,
		"show": false,
		"center": true,
		"resizable": false,
		"autoHideMenuBar": false,
		"alwaysOnTop": false,
		"useContentSize": false,
		"fullscreen": false,
		"skipTaskbar": false,
		"closable": true,
		"icon": Path.join(__dirname, '/assets/img/icon.png'),
		"webPreferences": {
			"devTools": false,
			"nodeIntegration": true,
			"contextIsolation": false
		}
	});

	// Load Main
	win.loadURL(Url.format({
		"pathname": Path.join(__dirname, 'main.html'),
		"protocol": 'file:',
		"slashes": true
	}));

	// Show
	win.once('ready-to-show', () => {
		setTimeout(function () {
			splash.destroy();
			win.show();
		}, 5000);
	});

	// Minimize
	win.on('minimize', (e) => {
		e.preventDefault();
		win.hide();
		tray = new Tray(Path.join(__dirname, '/assets/img/icon.ico'));
		tray.setToolTip('ReVen');
		const template = [
			{
				"label": 'Explore',
				click() { openBinFolder(); }
			},
			{ "type": 'separator' },
			{
				"label": 'Exit',
				click() { app.quit(); }
			}
		];
		const menu = Menu.buildFromTemplate(template);
		tray.setContextMenu(menu);
		tray.on('click', () => {
			win.show();
			tray.destroy();
		});
	});

	// Navigate
	win.webContents.on('will-navigate', (e, url) => {
		e.preventDefault();
		openURL(url);
	});

	// Open
	win.webContents.setWindowOpenHandler(({ url }) => {
		openURL(url);
		return { action: 'deny' }
	});

	// Dev
	// win.webContents.openDevTools();

});

/**---------------------------------------------------
 * Funtions (Helpers) :
 *----------------------------------------------------/

/**
 * Reload.
 */
function reload() {
	win.reload();
}

/**
 * Open URL.
 */
function openURL(url) {
	shell.openExternal(url);
}

/**
 * Format path.
 */
function formatPath(path) {
	return path.replace(/\//g, '\\');
}

/**
 * Open bin folder.
 */
function openBinFolder() {
	shell.openPath(
		formatPath(getPath('bin'))
	);
}

/**
 * Get path.
 */
function getPath(dir) {
	const root = Path.dirname(
		Path.dirname(__dirname)
	);
	return Path.join(root, dir + '/');
}

/**
 * Notify.
 */
function notify(msg) {
	if (Notification.isSupported()) {
		new Notification({
			"title": 'ReVen',
			"body": msg,
			"icon": Path.join(__dirname, '/assets/img/icon.png')
		}).show();
	}
}

/**
 * Download packages.
 */
function downloadPackages() {

	// Confirm
	const response = dialog.showMessageBoxSync(win, {
		"title": 'ReVen',
		"buttons": ['No', 'Yes'],
		"message": 'Do you want to download packages?'
	});
	if (response !== 1) { return; }

	// Download
	displayProgress();
	const host = 'https://reven.jihadsinnaour.com';
	const count = 1;
	for (let i = 0; i < count; i++) {
		const part = i+1;
		const file = `ReVen.zip.00${part}`;
		const url = `${host}/${file}`;
		download(url, file, part, count);
	}
}

/**
 * Async download.
 */
async function download(url, file, part, count) {

	// Init
	const response = await Axios({
		"url": url,
		"method": 'GET',
		"responseType": 'stream'
	});

	// Pipe
	const path = getPath('bin') + file;
	response.data.pipe(Fs.createWriteStream(formatPath(path)));

	// End
	response.data.on('end', () => {
		notify(`Package "${file}" succesfully downloaded`);
		complateProgress();
		if ( part == count ) {
			extractPackages();
		}
	});

	// Error
	response.data.on('error', (error) => {
		notify(`Downloaded failed: ${error}`);
		complateProgress();
	});
}

/**
 * Display progress.
 */
function displayProgress() {

	if ( bar ) {
		bar.close();
		bar = null;
	}
	
	bar = new Progress({
		"browserWindow": {
			"parent": win,
			"modal": true,
			"icon": Path.join(__dirname, '/assets/img/icon.ico'),
			'webPreferences': {
            	'nodeIntegration': true
        	}
		},
		"title": 'ReVen',
		"text": 'Downloading packages...',
		"detail": 'Please wait',
		"style": {
			"value": {
				"background-color": '#ff8636'
			}
		}
	});
	
	bar.on('completed', function() {
		bar.detail = 'Download completed. Exiting...';
		bar.close();
		bar = null;
	});
}

/**
 * Complate progress.
 */
function complateProgress () {
	if ( bar ) {
		bar.setCompleted();
	}
}

/**
 * Extract packages.
 */
function extractPackages() {
	const bat = getPath('bin') + 'extract.bat';
	shell.openPath(bat);
}

/**---------------------------------------------------
 * Modals (Window) :
 *----------------------------------------------------/

/**
 * Open about.
 */
function openAbout() {

	/**
	 * About init.
	 */
	let about = null;
	about = new BrowserWindow({
		"parent": win,
		"modal": true,
		"height": 430,
		"width": 500,
		"show": false,
		"resizable": false,
		"autoHideMenuBar": true,
		"minimizable": false,
		"maximizable": false,
		"icon": Path.join(__dirname, '/assets/img/icon.png')
	});

	// Remove menu
	about.removeMenu();

	// Load About
	about.loadURL(Url.format({
		"pathname": Path.join(__dirname, 'about.html'),
		"protocol": 'file:',
		"slashes": true
	}));

	// Show About
	about.webContents.on('dom-ready', () => {
		about.show();
	});

	// Navigate
	about.webContents.on('will-navigate', (e, url) => {
		e.preventDefault();
		openURL(url);
	});

	// Open
	about.webContents.setWindowOpenHandler(({ url }) => {
		openURL(url);
		return { action: 'deny' }
	});
}

/**
 * Open doc.
 */
function openDoc() {

	/**
	 * Doc init.
	 */
	let doc = null;
	doc = new BrowserWindow({
		"parent": win,
		"modal": true,
		"height": 560,
		"width": 600,
		"show": false,
		"resizable": false,
		"autoHideMenuBar": true,
		"minimizable": false,
		"maximizable": false,
		"icon": Path.join(__dirname, '/assets/img/icon.png')
	});

	// Remove menu
	doc.removeMenu();

	// Load Doc
	doc.loadURL(Url.format({
		"pathname": Path.join(__dirname, 'doc.html'),
		"protocol": 'file:',
		"slashes": true
	}));

	// Show Doc
	doc.webContents.on('dom-ready', () => {
		doc.show();
	});

	// Navigate
	doc.webContents.on('will-navigate', (e, url) => {
		e.preventDefault();
		openURL(url);
	});

	// Open
	doc.webContents.setWindowOpenHandler(({ url }) => {
		openURL(url);
		return { action: 'deny' }
	});
}
