/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { shell, dialog, Notification } = require('electron');
const config = require('../config/app.json');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').execFile;
const url = require('url');
const https = require('https');
const http = require('http');

let downloadAborted = false;

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
 * Restart app.
 */
function restart(app) {
	app.relaunch();
	app.exit();
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
 * Get extension.
 */
function getExtension(item) {
	let ext = path.extname(item);
	return ext.replace(/[^\w]|[\s]/g, '');
}

/**
 * Open item with program.
 */
function openWith(item, program) {
	exec(program, [item], (error, stdout, stderr) => {
		if (error) {
			console.error('Error opening file:', error);
		}
	});
}

/**
 * Open item.
 */
async function openItem(item) {

	let baseDir = config.baseDir ? path.join(config.baseDir, 'bin') : getRoot('bin');

	item = formatPath(`${baseDir}${item}`);
	const ext = getExtension(item);

	if (['xm'].includes(ext)) {
		const player = formatPath(`${baseDir}${config.player}`);
		openWith(item, player);

	} else {
		try {
			await shell.openPath(`"${item}"`);
		} catch (error) { }
	}
}

/**
 * Open bin folder.
 */
function openBinFolder() {
	let baseDir;

	if (config.baseDir) {
		baseDir = path.join(config.baseDir, 'bin');
	} else {
		baseDir = getRoot('bin');
	}

	// Create bin directory if it doesn't exist
	if (!fs.existsSync(baseDir)) {
		try {
			fs.mkdirSync(baseDir, { recursive: true });
		} catch (error) {
			console.error('Error creating bin folder:', error);
		}
	}

	shell.openPath(
		formatPath(baseDir)
	);
}

/**
 * Open info.
 */
function openInfo() {
	let infoPath;
	if (config.debug) {
		const fileName = 'packages.txt';
		// Dev mode: assets/installer folder
		infoPath = path.join(getRoot(), 'assets', 'installer', fileName);
	} else {
		// Production
		infoPath = path.join(getRoot(), '..', fileName);
	}
	shell.openPath(infoPath);
}

/**
 * Open changelog.
 */
function openChangelog() {
	let changelogPath;
	if (config.debug) {
		const fileName = 'changelog.txt';
		// Dev mode: assets/installer folder
		changelogPath = path.join(getRoot(), 'assets', 'installer', fileName);
	} else {
		// Production
		changelogPath = path.join(getRoot(), '..', fileName);
	}
	shell.openPath(changelogPath);
}

/**
 * Download packages with confirmation.
 */
async function downloadPackages(launcher) {
	const response = await dialog.showMessageBox({
		type: 'question',
		buttons: ['Download', 'Cancel'],
		defaultId: 0,
		title: 'Download Packages',
		message: 'Download all packages?',
		detail: `This will download ${config.items.parts.length} package files to your bin folder.`
	});

	if (response.response === 0) {
		downloadAborted = false;
		launcher.webContents.send('open-download');
		startDownload(launcher);
	}
}

/**
 * Start downloading packages.
 */
async function startDownload(launcher) {
	const baseDir = config.baseDir ? path.join(config.baseDir, 'bin') : getRoot('bin');

	// Create bin directory if it doesn't exist
	if (!fs.existsSync(baseDir)) {
		try {
			fs.mkdirSync(baseDir, { recursive: true });
		} catch (error) {
			sendDownloadProgress(launcher, {
				progress: 0,
				currentFile: '',
				status: 'Error creating bin folder',
				completed: true
			});
			return;
		}
	}

	const parts = config.items.parts;
	const host = config.items.host;
	const appRoot = config.baseDir || getRoot();
	const sevenZipPath = path.join(appRoot, 'inc', '7z.exe');

	// Check if 7z.exe exists
	if (!fs.existsSync(sevenZipPath)) {
		sendDownloadProgress(launcher, {
			progress: 0,
			currentFile: '',
			status: `Error: 7z.exe not found at ${sevenZipPath}`,
			completed: true
		});
		return;
	}

	for (let i = 0; i < parts.length; i++) {
		if (downloadAborted) {
			sendDownloadProgress(launcher, {
				progress: Math.round(((i) / parts.length) * 100),
				currentFile: '',
				status: 'Download aborted',
				completed: true
			});
			return;
		}

		const fileName = parts[i];
		const fileUrl = `${host}/${fileName}`;
		const filePath = path.join(baseDir, fileName);

		sendDownloadProgress(launcher, {
			progress: Math.round((i / parts.length) * 100),
			currentFile: fileName,
			status: `Downloading ${i + 1}/${parts.length}...`
		});

		try {
			await downloadFile(fileUrl, filePath);

			if (downloadAborted) {
				// Clean up partial download
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
				sendDownloadProgress(launcher, {
					progress: Math.round(((i) / parts.length) * 100),
					currentFile: '',
					status: 'Download aborted',
					completed: true
				});
				return;
			}

			sendDownloadProgress(launcher, {
				progress: Math.round(((i + 0.5) / parts.length) * 100),
				currentFile: fileName,
				status: `Extracting ${i + 1}/${parts.length}...`
			});

			await extractZip(sevenZipPath, filePath, baseDir);

			// Delete zip file after extraction
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}

		} catch (error) {
			sendDownloadProgress(launcher, {
				progress: Math.round((i / parts.length) * 100),
				currentFile: fileName,
				status: `Error: ${error.message}`,
				completed: true
			});
			return;
		}
	}

	sendDownloadProgress(launcher, {
		progress: 100,
		currentFile: '',
		status: 'Download completed!',
		completed: true
	});
}

/**
 * Download a file from URL.
 */
function downloadFile(fileUrl, filePath) {
	return new Promise((resolve, reject) => {
		const protocol = fileUrl.startsWith('https') ? https : http;
		const file = fs.createWriteStream(filePath);

		protocol.get(fileUrl, (response) => {
			if (response.statusCode !== 200) {
				reject(new Error(`Failed to download: ${response.statusCode}`));
				return;
			}

			response.pipe(file);

			file.on('finish', () => {
				file.close();
				if (downloadAborted) {
					reject(new Error('Download aborted'));
				} else {
					resolve();
				}
			});

		}).on('error', (error) => {
			fs.unlink(filePath, () => { });
			reject(error);
		});

		file.on('error', (error) => {
			fs.unlink(filePath, () => { });
			reject(error);
		});
	});
}

/**
 * Extract zip file using 7z.exe.
 */
function extractZip(sevenZipPath, zipPath, outputDir) {
	return new Promise((resolve, reject) => {
		const args = ['x', zipPath, `-o${outputDir}`, '-y'];

		exec(sevenZipPath, args, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

/**
 * Send download progress to renderer.
 */
function sendDownloadProgress(launcher, data) {
	launcher.webContents.send('download-progress', data);
}

/**
 * Abort download.
 */
function abortDownload() {
	downloadAborted = true;
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
 * Check package status.
 */
function checkPackageStatus() {
	try {
		const itemsPath = path.resolve(__dirname, '..', 'config', 'items.json');
		const items = JSON.parse(fs.readFileSync(itemsPath, 'utf-8')).items;

		const baseDir = config.baseDir ? path.join(config.baseDir, 'bin') : getRoot('bin');

		// Check if base directory exists
		if (!fs.existsSync(baseDir)) {
			return {
				status: 'empty',
				message: 'No packages',
				color: 'red',
				existing: 0,
				total: items.length,
				disabledPaths: items.map(item => item.path).filter(Boolean)
			};
		}

		// Check each item
		let existingCount = 0;
		const totalCount = items.length;
		const disabledPaths = [];

		for (const item of items) {
			if (!item.path) continue;

			const itemPath = formatPath(`${baseDir}${item.path}`);

			// Check if path exists (file or directory)
			if (fs.existsSync(itemPath)) {
				existingCount++;
			} else {
				disabledPaths.push(item.path);
			}
		}

		// Determine status
		if (existingCount === 0) {
			return {
				status: 'empty',
				message: 'No packages',
				color: 'red',
				existing: 0,
				total: totalCount,
				disabledPaths
			};
		} else if (existingCount === totalCount) {
			return {
				status: 'ready',
				message: `Ready (${existingCount} items)`,
				color: 'green',
				existing: existingCount,
				total: totalCount,
				disabledPaths: [] // Empty array when all items exist
			};
		} else {
			return {
				status: 'partial',
				message: `Missing packages (${existingCount}/${totalCount})`,
				color: 'orange',
				existing: existingCount,
				total: totalCount,
				disabledPaths
			};
		}

	} catch (error) {
		console.error('Error checking package status:', error);
		return {
			status: 'error',
			message: 'Error checking packages',
			color: 'red',
			existing: 0,
			total: 0,
			disabledPaths: []
		};
	}
}

module.exports = {
	setup,
	isWindows,
	openUrl,
	formatUrl,
	getPath,
	reload,
	restart,
	openItem,
	openInfo,
	openChangelog,
	openBinFolder,
	downloadPackages,
	startDownload,
	abortDownload,
	checkPackageStatus
};
