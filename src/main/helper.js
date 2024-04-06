/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

const { shell, dialog, Notification } = require('electron');
const config = require('../config/app.json');
const path = require('path');
const url = require('url');
const fs = require('fs');
const Axios = require('axios');
const Progress = require('electron-progressbar');

/**
 * Setup env.
 */
function setup() {
	process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
}

/**
 * Check Windows OS.
 */
function isWindows() {
	return (process.platform === 'win32');
}

/**
 * Reload launcher.
 */
function reload(launcher) {
	launcher.reload();
}

/**
 * Open URL.
 */
function openUrl(url) {
	shell.openExternal(url);
}

/**
 * Format URL.
 */
function formatUrl(objct) {
    return url.format(objct);
}

/**
 * Format path.
 */
function formatPath(path) {
	return path.replace(/\//g, '\\');
}

/**
 * Open item.
 */
async function openItem(path) {
	let baseDir = config.baseDir;
	if ( !baseDir ) {
		baseDir = getRoot('bin');
	}
	path = formatPath(baseDir + path);
	path = `"${path}"`;
	try {
		console.log(path);
		await shell.openPath(path);
	} catch (error) {}
}

/**
 * Open bin folder.
 */
function openBinFolder() {
	shell.openPath(
		formatPath(getRoot('bin'))
	);
}

/**
 * Get path.
 */
function getPath(file) {
	const root = path.resolve(__dirname, '..');
    return formatPath(
		path.join(root, file)
	);
}

/**
 * Get root path.
 */
function getRoot(dir) {
	let root = path.resolve(__dirname, '..', '..');
    return dir ? path.resolve(root, dir) : root;
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
	let path = getRoot('bin') + file;
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
            	'nodeIntegration': false
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
	const bat = getRoot('bin') + `${name}.bat`;

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
	const md = getRoot('/') + 'ReVens.md';
	shell.openPath(md);
}

/**
 * Open changelog.
 */
function openChangelog() {
	const c = getRoot('/') + 'changelog.txt';
	shell.openPath(c);
}

module.exports = {
    setup,
    isWindows,
    openUrl,
    formatUrl,
    getPath,
    reload,
    openItem,
    openInfo,
    openChangelog,
    openBinFolder,
};
