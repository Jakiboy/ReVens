/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { shell, dialog } = require('electron');
const config = require('../config/app.json');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').execFile;
const url = require('url');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

let downloadAborted = false;
let itemDownloadAborted = false;
let aiDownloadAborted = false;
let currentAIRequest = null;

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
 * Get bin directory path.
 */
function getBinDir() {
	return config.baseDir ? config.baseDir : getRoot('bin');
}

/**
 * Get extension.
 */
function getExtension(item) {
	const ext = path.extname(item);
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
	const baseDir = getBinDir();
	const itemPath = formatPath(path.join(baseDir, item));
	const ext = getExtension(itemPath);

	if (ext === 'xm') {
		const playerPath = formatPath(path.join(baseDir, config.player));
		openWith(itemPath, playerPath);
	} else {
		try {
			await shell.openPath(itemPath);
		} catch (error) {
			console.error('Error opening item:', error);
		}
	}
}

/**
 * Explore item folder.
 */
async function exploreItem(item) {
	const baseDir = getBinDir();
	const itemPath = formatPath(path.join(baseDir, item));
	const itemDir = path.dirname(itemPath);

	try {
		// Check if directory exists
		if (fs.existsSync(itemDir)) {
			await shell.openPath(itemDir);
		} else {
			console.error('Directory does not exist:', itemDir);
		}
	} catch (error) {
		console.error('Error exploring item:', error);
	}
}

/**
 * Open bin folder.
 */
function openBinFolder() {
	const baseDir = getBinDir();

	// Create bin directory if it doesn't exist
	if (!fs.existsSync(baseDir)) {
		try {
			fs.mkdirSync(baseDir, { recursive: true });
		} catch (error) {
			console.error('Error creating bin folder:', error);
			return;
		}
	}

	shell.openPath(baseDir);
}

/**
 * Download AI assistant.
 */
function downloadAIAssistant(launcher) {

	const appRoot = config.baseDir || getRoot();
	const installerName = config.ai?.name || 'AI';
	const installerUrl = config.ai.download;
	const installerPath = path.join(appRoot, 'inc', path.basename(installerUrl));

	// Check if installer already exists and is valid
	if (fs.existsSync(installerPath)) {
		try {
			// Verify file is readable and has size > 0
			const stats = fs.statSync(installerPath);
			if (stats.size > 0) {
				if (!launcher.isDestroyed()) {
					launcher.webContents.send('open-ai-download');
					launcher.webContents.send('ai-download-progress', {
						progress: 100,
						status: 'Installer already downloaded!',
						completed: true,
						installerPath: installerPath
					});
				}
				return;
			} else {
				// File is corrupted (0 bytes), delete it
				fs.unlinkSync(installerPath);
			}
		} catch (error) {
			// File is corrupted or unreadable, delete it
			try {
				fs.unlinkSync(installerPath);
			} catch (unlinkError) {
				// Ignore unlink errors
			}
		}
	}

	// Reset abort flag
	aiDownloadAborted = false;

	// Open download modal
	if (!launcher.isDestroyed()) {
		launcher.webContents.send('open-ai-download');
	}

	// Start downloading
	downloadFileWithProgress(
		installerUrl,
		installerPath,
		(progress) => {
			if (!launcher.isDestroyed() && !aiDownloadAborted) {
				launcher.webContents.send('ai-download-progress', {
					progress: progress,
					status: `Downloading ${installerName} installer...`
				});
			}
		},
		'ai'

	).then(() => {
		if (!launcher.isDestroyed() && !aiDownloadAborted) {
			launcher.webContents.send('ai-download-progress', {
				progress: 100,
				status: 'Download completed!',
				completed: true,
				installerPath: installerPath
			});
		}

	}).catch((error) => {
		if (!launcher.isDestroyed()) {
			launcher.webContents.send('ai-download-progress', {
				progress: 0,
				status: aiDownloadAborted ? 'Download aborted' : `Download failed: ${error.message}`,
				completed: true,
				error: !aiDownloadAborted
			});
		}
	});
}

/**
 * Get asset file path (handles dev/production modes).
 */
function getAssetPath(fileName) {
	if (config.debug) {
		return path.join(getRoot(), 'assets', 'installer', fileName);
	}
	return path.join(getRoot(), '..', fileName);
}

/**
 * Open changelog.
 */
function openChangelog() {
	shell.openPath(getAssetPath('changelog.txt'));
}

/**
 * Download packages with confirmation.
 */
async function downloadPackages(launcher) {
	// Prevent download when baseDir is defined and debug mode is enabled
	if (config.baseDir && config.debug) {
		await dialog.showMessageBox({
			type: 'warning',
			buttons: ['OK'],
			title: 'Download Disabled',
			message: 'Package download is disabled',
			detail: 'Download is not available when baseDir is set in debug mode.'
		});
		return;
	}

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
	const baseDir = getBinDir();

	// Create bin directory if it doesn't exist
	if (!fs.existsSync(baseDir)) {
		try {
			fs.mkdirSync(baseDir, { recursive: true });
		} catch (error) {
			sendDownloadProgress(launcher, {
				progress: 0,
				currentFile: '',
				status: `Error creating bin folder: ${error.message}`,
				completed: true
			});
			return;
		}
	}

	const parts = config.items.parts;
	let host = config.items.host;

	// Append /test to host URL in debug mode
	if (config.debug) {
		host = `${host}/test`;
	}

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

		const part = parts[i];
		const fileName = typeof part === 'string' ? part : part.name;
		const expectedHash = typeof part === 'object' ? part.hash : null;
		const token = config.items.token || '';
		// Add cache buster to bypass CDN/Cloudflare cache
		const cacheBuster = `v=${config.version || Date.now()}`;
		const separator = token ? '&' : '?';
		const fileUrl = `${host}/${fileName}${token ? '?token=' + token : ''}${separator}${cacheBuster}`;
		const filePath = path.join(baseDir, fileName);

		sendDownloadProgress(launcher, {
			progress: Math.round((i / parts.length) * 100),
			currentFile: fileName,
			status: `Downloading ${i + 1}/${parts.length}...`
		});

		try {
			// Download with hash calculation if hash is expected
			const actualHash = await downloadFile(fileUrl, filePath, !!expectedHash);

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

			// Verify MD5 hash if available
			if (expectedHash && actualHash) {
				sendDownloadProgress(launcher, {
					progress: Math.round(((i + 0.3) / parts.length) * 100),
					currentFile: fileName,
					status: `Verifying ${i + 1}/${parts.length}...`
				});

				if (actualHash !== expectedHash) {
					// Hash mismatch - delete corrupted file
					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath);
					}
					sendDownloadProgress(launcher, {
						progress: Math.round((i / parts.length) * 100),
						currentFile: fileName,
						status: `Error: File integrity check failed for ${fileName}`,
						completed: true
					});
					return;
				}
			}

			sendDownloadProgress(launcher, {
				progress: Math.round(((i + 0.5) / parts.length) * 100),
				currentFile: fileName,
				status: `Extracting ${i + 1}/${parts.length}...`
			});

			// Extract with password from config
			const password = config.items.pswd || null;
			await extractArchive(sevenZipPath, filePath, baseDir, password);

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

	// Update package status to refresh button states
	const status = checkPackageStatus();
	launcher.webContents.send('package-status', status);
}

/**
 * Download a file from URL, optionally calculating MD5 hash during download.
 */
function downloadFile(fileUrl, filePath, calculateHash = false) {
	return new Promise((resolve, reject) => {
		const protocol = fileUrl.startsWith('https') ? https : http;
		const file = fs.createWriteStream(filePath);
		const hash = calculateHash ? crypto.createHash('md5') : null;

		const cleanup = () => {
			file.close();
			fs.unlink(filePath, () => { });
		};

		protocol.get(fileUrl, (response) => {
			if (response.statusCode !== 200) {
				cleanup();
				reject(new Error(`Failed to download: ${response.statusCode}`));
				return;
			}

			response.pipe(file);

			// If calculating hash, also pipe data to hash
			if (hash) {
				response.on('data', (chunk) => {
					hash.update(chunk);
				});
			}

			file.on('finish', () => {
				file.close();
				if (downloadAborted) {
					fs.unlink(filePath, () => { });
					reject(new Error('Download aborted'));
				} else {
					const md5Hash = hash ? hash.digest('hex') : null;
					resolve(md5Hash);
				}
			});

			file.on('error', (error) => {
				cleanup();
				reject(error);
			});

		}).on('error', (error) => {
			cleanup();
			reject(error);
		});
	});
}

/**
 * Extract archive (zip, 7z, rar, iso, etc.) using 7z.exe.
 */
function extractArchive(sevenZipPath, archivePath, outputDir, password = null) {
	return new Promise((resolve, reject) => {
		const args = ['x', archivePath, `-o${outputDir}`, '-y'];

		// Add password if provided
		if (password) {
			args.push(`-p${password}`);
		}

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
 * Create backup zip of directory using 7z.exe.
 */
function createBackupZip(sevenZipPath, sourceDir, outputZip) {
	return new Promise((resolve, reject) => {
		const args = ['a', '-tzip', outputZip, `${sourceDir}${path.sep}*`];

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
 * Flatten nested directory - move all contents from first subdirectory to parent.
 */
function flattenDirectory(targetDir) {
	try {
		const items = fs.readdirSync(targetDir);

		// Filter out files, only look for directories
		const dirs = items.filter(item => {
			const fullPath = path.join(targetDir, item);
			return fs.statSync(fullPath).isDirectory();
		});

		// If there's exactly one directory, move its contents up
		if (dirs.length === 1) {
			const nestedDir = path.join(targetDir, dirs[0]);
			const nestedItems = fs.readdirSync(nestedDir);

			// Move each item from nested dir to parent
			for (const item of nestedItems) {
				const oldPath = path.join(nestedDir, item);
				const newPath = path.join(targetDir, item);
				fs.renameSync(oldPath, newPath);
			}

			// Remove the now-empty nested directory
			fs.rmdirSync(nestedDir);
		}
	} catch (error) {
		console.error('Error flattening directory:', error);
		throw error;
	}
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

		const baseDir = getBinDir();

		// Check if base directory exists
		if (!fs.existsSync(baseDir)) {
			return {
				status: 'empty',
				message: 'No packages',
				color: 'red',
				existing: 0,
				total: items.length,
				disabledPaths: items.map(item => item.slug).filter(Boolean)
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
				disabledPaths.push(item.slug);
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

/**
 * Send item download progress.
 */
function sendItemDownloadProgress(launcher, data) {
	launcher.webContents.send('item-download-progress', data);
}

/**
 * Abort item download.
 */
function abortItemDownload() {
	itemDownloadAborted = true;
}

/**
 * Download a single item.
 */
async function downloadSingleItem(launcher, item) {
	itemDownloadAborted = false;
	const baseDir = getBinDir();

	// Ensure bin directory exists
	if (!fs.existsSync(baseDir)) {
		try {
			fs.mkdirSync(baseDir, { recursive: true });
		} catch (error) {
			sendItemDownloadProgress(launcher, {
				progress: 0,
				status: `Error creating directory: ${error.message}`,
				completed: true
			});
			return;
		}
	}

	// Open the download modal
	launcher.webContents.send('open-item-download', { name: item.name });

	// Replace {version} placeholder in download URL
	let fileUrl = item.download;
	if (item.version && fileUrl.includes('{version}')) {
		fileUrl = fileUrl.replace(/{version}/g, item.version);
	}

	const fileName = path.basename(fileUrl.split('?')[0]); // Remove query params for filename
	const itemDir = path.dirname(formatPath(path.join(baseDir, item.path)));
	const filePath = path.join(itemDir, fileName);
	const versionFilePath = path.join(itemDir, 'version.revens.txt');

	// Check if version file exists and compare versions
	if (item.version && fs.existsSync(versionFilePath)) {
		try {
			const installedVersion = fs.readFileSync(versionFilePath, 'utf-8').trim();
			if (installedVersion === item.version) {
				sendItemDownloadProgress(launcher, {
					progress: 100,
					status: `Already up to date! (v${item.version})`,
					completed: true
				});
				return;
			}
		} catch (error) {
			// Continue with download if version check fails
		}
	}

	// Check if directory exists and create backup before downloading
	if (fs.existsSync(itemDir)) {
		const backupPath = `${itemDir}.backup.zip`;

		// Only create backup if it doesn't already exist
		if (!fs.existsSync(backupPath)) {
			sendItemDownloadProgress(launcher, {
				progress: 5,
				status: 'Creating backup...'
			});

			try {
				const appRoot = config.baseDir || getRoot();
				const sevenZipPath = path.join(appRoot, 'inc', '7z.exe');

				if (fs.existsSync(sevenZipPath)) {
					await createBackupZip(sevenZipPath, itemDir, backupPath);
				}
			} catch (backupError) {
				// Continue even if backup fails
				sendItemDownloadProgress(launcher, {
					progress: 10,
					status: 'Backup failed, continuing with download...'
				});
			}
		}
	}

	// Create item directory if it doesn't exist
	if (!fs.existsSync(itemDir)) {
		try {
			fs.mkdirSync(itemDir, { recursive: true });
		} catch (error) {
			sendItemDownloadProgress(launcher, {
				progress: 0,
				status: `Error creating directory: ${error.message}`,
				completed: true
			});
			return;
		}
	}

	sendItemDownloadProgress(launcher, {
		progress: 10,
		status: 'Downloading...'
	});

	try {
		await downloadFileWithProgress(fileUrl, filePath, (progress) => {
			if (!itemDownloadAborted) {
				sendItemDownloadProgress(launcher, {
					progress: 10 + Math.round(progress * 0.8),
					status: 'Downloading...'
				});
			}
		});

		if (itemDownloadAborted) {
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
			sendItemDownloadProgress(launcher, {
				progress: 0,
				status: 'Download aborted',
				completed: true
			});
			return;
		}

		// Check if file is an archive and item type is exe
		const fileExt = path.extname(fileName).toLowerCase();
		const isArchive = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'].includes(fileExt);
		const shouldExtract = (item.type === 'exe' || item.type === 'cli') && isArchive;

		if (shouldExtract) {
			sendItemDownloadProgress(launcher, {
				progress: 90,
				status: 'Extracting archive...'
			});

			const appRoot = config.baseDir || getRoot();
			const sevenZipPath = path.join(appRoot, 'inc', '7z.exe');

			// Check if 7z.exe exists
			if (!fs.existsSync(sevenZipPath)) {
				sendItemDownloadProgress(launcher, {
					progress: 100,
					status: `Downloaded, but 7z.exe not found at ${sevenZipPath}`,
					completed: true
				});
				return;
			}

			try {
				// Use item password if defined
				const itemPassword = (item.pswd && item.pswd !== false) ? item.pswd : null;
				await extractArchive(sevenZipPath, filePath, itemDir, itemPassword);

				// Remove archive after successful extraction
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}				// Post-extraction processing (script property)
				if (item.script && item.script !== false) {
					sendItemDownloadProgress(launcher, {
						progress: 95,
						status: 'Processing files...'
					});

					// Handle string or array of scripts
					const scripts = Array.isArray(item.script) ? item.script : [item.script];

					for (const script of scripts) {
						if (script === 'flatten') {
							try {
								flattenDirectory(itemDir);
							} catch (flattenError) {
								// Continue even if flattening fails
							}
						}
						// Add more script commands here in the future
					}
				}

				// Save version file
				if (item.version) {
					try {
						fs.writeFileSync(versionFilePath, item.version, 'utf-8');
					} catch (versionError) {
						// Continue even if version file creation fails
					}
				}

				sendItemDownloadProgress(launcher, {
					progress: 100,
					status: 'Download and extraction completed!',
					completed: true
				});

				// Update package status to refresh button state
				const status = checkPackageStatus();
				launcher.webContents.send('package-status', status);

			} catch (extractError) {
				// If extraction fails, keep the archive
				sendItemDownloadProgress(launcher, {
					progress: 100,
					status: `Downloaded, but extraction failed: ${extractError.message}`,
					completed: true
				});
			}

		} else {
			// Save version file
			if (item.version) {
				try {
					fs.writeFileSync(versionFilePath, item.version, 'utf-8');
				} catch (versionError) {
					// Continue even if version file creation fails
				}
			}

			sendItemDownloadProgress(launcher, {
				progress: 100,
				status: 'Download completed!',
				completed: true
			});

			// Update package status to refresh button state
			const status = checkPackageStatus();
			launcher.webContents.send('package-status', status);
		}

	} catch (error) {
		sendItemDownloadProgress(launcher, {
			progress: 0,
			status: `Error: ${error.message}`,
			completed: true
		});
	}
}

/**
 * Download file with progress tracking.
 */
function downloadFileWithProgress(fileUrl, filePath, onProgress, downloadType = 'item') {
	return new Promise((resolve, reject) => {
		const protocol = fileUrl.startsWith('https') ? https : http;
		const file = fs.createWriteStream(filePath);

		const cleanup = () => {
			file.close();
			fs.unlink(filePath, () => { });
		};

		const isAborted = () => {
			if (downloadType === 'ai') return aiDownloadAborted;
			return itemDownloadAborted;
		};

		const request = protocol.get(fileUrl, (response) => {
			if (response.statusCode === 302 || response.statusCode === 301 || response.statusCode === 307 || response.statusCode === 308) {
				// Handle redirects
				cleanup();
				downloadFileWithProgress(response.headers.location, filePath, onProgress, downloadType)
					.then(resolve)
					.catch(reject);
				return;
			}

			if (response.statusCode !== 200) {
				cleanup();
				reject(new Error(`Failed to download: ${response.statusCode}`));
				return;
			}

			const totalSize = parseInt(response.headers['content-length'], 10);
			let downloadedSize = 0;

			response.on('data', (chunk) => {
				if (isAborted()) {
					response.destroy();
					cleanup();
					reject(new Error('Download aborted'));
					return;
				}
				downloadedSize += chunk.length;
				if (totalSize && onProgress) {
					onProgress(downloadedSize / totalSize);
				}
			});

			response.pipe(file);

			file.on('finish', () => {
				file.close();
				if (isAborted()) {
					fs.unlink(filePath, () => { });
					reject(new Error('Download aborted'));
				} else {
					resolve();
				}
			});

			file.on('error', (error) => {
				cleanup();
				reject(error);
			});

		}).on('error', (error) => {
			cleanup();
			reject(error);
		});

		if (downloadType === 'ai') {
			currentAIRequest = request;
		}
	});
}

/**
 * Abort AI download.
 */
function abortAIDownload() {
	aiDownloadAborted = true;
	if (currentAIRequest) {
		currentAIRequest.destroy();
		currentAIRequest = null;
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
	exploreItem,
	openChangelog,
	openBinFolder,
	downloadAIAssistant,
	downloadPackages,
	startDownload,
	abortDownload,
	checkPackageStatus,
	downloadSingleItem,
	abortItemDownload,
	abortAIDownload
};
