/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

'use strict';

/**
 * Electron init.
 */
const { app, shell, dialog, Menu, Tray, Notification, BrowserWindow, globalShortcut } = require('electron');

/**
 * Dependencies init.
 */
const path = require('path');
const url = require('url');
const fs = require('fs');
const Axios = require('axios');
const Progress = require('electron-progressbar');

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
			{
				"label": 'Packages',
				"accelerator": 'Ctrl+P',
				click() { openInfo(); }
			},
			{
				"label": 'Changelog',
				"accelerator": 'Ctrl+X',
				click() { openChangelog(); }
			},
			{ "type": 'separator' },
			{
				"label": 'Update',
				"accelerator": 'Ctrl+U',
				click() { openURL('https://github.com/Jakiboy/ReVens/releases'); }
			}, ,
			{ "type": 'separator' },
			{
				"label": 'Report issue',
				"accelerator": 'Ctrl+I',
				click() { openURL('https://github.com/Jakiboy/ReVens/issues'); }
			},
			{
				"label": 'Edit packages',
				click() { openURL('https://github.com/Jakiboy/ReVens/pulls'); }
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
		app.setAppUserModelId('ReVens');
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
	splash.loadURL(url.format({
		"pathname": path.join(__dirname, 'splash.html'),
		"protocol": 'file:',
		"slashes": true
	}));

	// Setup Main
	win = new BrowserWindow({
		"title": 'ReVens - Reverse Engineering AIO',
		"frame": true,
		"width": 1000,
		"height": 720,
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
		"icon": path.join(__dirname, '../app/assets/img/icon.png'),
		"webPreferences": {
			"devTools": true,
			"nodeIntegration": true,
			"contextIsolation": false
		}
	});

	// Load Main
	win.loadURL(url.format({
		"pathname": path.join(__dirname, 'main.html'),
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
		tray = new Tray(path.join(__dirname, './app/assets/img/icon.ico'));
		tray.setToolTip('ReVens');
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
	win.webContents.openDevTools();

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
	const root = path.dirname(
		path.dirname(__dirname)
	);
	return path.join(root, dir + '/');
}

/**
 * Notify.
 */
function notify(msg) {
	if (Notification.isSupported()) {
		new Notification({
			"title": 'ReVens',
			"body": msg,
			"icon": path.join(__dirname, '../app/assets/img/icon.png')
		}).show();
	}
}

/**
 * Download packages.
 */
function downloadPackages() {

	// Confirm
	const response = dialog.showMessageBoxSync(win, {
		"title": 'ReVens',
		"buttons": ['No', 'Yes'],
		"message": 'Do you want to download packages?'
	});
	if (response !== 1) { return; }

	// Download
	displayProgress();
	
	const config = formatPath(
		path.join(__dirname, '/config/app.json')
	);

	fs.readFile(config, "utf8", (err, json) => {
		if (!err) {
			
			const c = JSON.parse(json);
			let packages = [], host;

			packages = c.packages;
			host = c.host;

			if ( !packages || !host ) {
				notify('Download failed: Invalid config');
				return;
			}

			let part = 0;
			packages.forEach(function(file) {
				part++;
				const url = `${host}/${file}`;
				download(url, file, part, packages.length);
			});
		}
	});
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
	let path = getPath('bin') + file;
	path = formatPath(path);
	response.data.pipe(fs.createWriteStream(path));

	// End
	response.data.on('end', () => {
		extractPackage(file);
		if ( part == count ) {
			complateProgress();
			notify('Packages succesfully downloaded');
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
			"icon": path.join(__dirname, './app/assets/img/icon.ico'),
			'webPreferences': {
            	'nodeIntegration': true
        	}
		},
		"title": 'ReVens',
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
 * Extract package.
 */
function extractPackage(file) {
	const name = file.replace('.iso', '');
	const bat = getPath('bin') + `${name}.bat`;

	let cmd  = `7z.exe x "./${name}.iso" -y`;
	    cmd += "\n";
	    cmd += `del \\f "./${name}.iso"`;

	fs.writeFile(bat, cmd, function (err) {});

	setTimeout(function() {
		shell.openPath(bat);
	}, 2000);
}

/**
 * Open info.
 */
function openInfo() {
	const md = getPath('/') + 'ReVens.md';
	shell.openPath(md);
}

/**
 * Open changelog.
 */
function openChangelog() {
	const c = getPath('/') + 'changelog.txt';
	shell.openPath(c);
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
		"icon": path.join(__dirname, '../app/assets/img/icon.png')
	});

	// Remove menu
	about.removeMenu();

	// Load About
	about.loadURL(url.format({
		"pathname": path.join(__dirname, 'about.html'),
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
		"icon": path.join(__dirname, '../app/assets/img/icon.png')
	});

	// Remove menu
	doc.removeMenu();

	// Load Doc
	doc.loadURL(url.format({
		"pathname": path.join(__dirname, 'doc.html'),
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
