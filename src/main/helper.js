/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { shell, dialog, app } = require('electron');
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
 * Load settings from userData.
 */
function loadSettings() {
	try {
		const settingsPath = path.join(app.getPath('userData'), 'settings.json');
		if (fs.existsSync(settingsPath)) {
			return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
		}
	} catch (error) {
		console.error('Error loading settings:', error);
	}
	return {};
}

/**
 * Save settings to userData.
 */
function saveSettings(settings) {
	try {
		fs.writeFileSync(path.join(app.getPath('userData'), 'settings.json'), JSON.stringify(settings, null, 2), 'utf8');
		return true;
	} catch (error) {
		console.error('Error saving settings:', error);
		return false;
	}
}

/**
 * Setup env.
 */
function setup() {
	process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
}

/**
 * Check if running as administrator (Windows only).
 */
function isAdmin() {
	if (process.platform !== 'win32') return true;
	try {
		require('child_process').execSync('net session', { stdio: 'ignore' });
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Relaunch app with administrator privileges.
 */
function relaunchAsAdmin(app) {
	const execPath = process.execPath;
	const args = process.argv.slice(1).map(a => a.replace(/'/g, "''"));
	const argsStr = args.length ? `-ArgumentList ${args.map(a => `'${a}'`).join(',')}` : '';
	require('child_process').exec(
		`powershell -Command "Start-Process '${execPath}' ${argsStr} -Verb RunAs"`,
		() => { }
	);
	app.quit();
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
	const installerPath = path.join(appRoot, 'inc', path.basename(installerUrl.split('?')[0]));

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
					progress: Math.round(progress * 100),
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
 * - Pipeline: next file downloads while current file is being extracted.
 * - Keep-alive agent: reuses TCP connections across all files.
 * - Skip already-extracted: resumes an interrupted session automatically.
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

	const settings = loadSettings();
	const enabledPackages = settings.packages || {};
	const parts = config.items.parts.filter(part => {
		const name = typeof part === 'string' ? part : part.name;
		return enabledPackages[name] !== false;
	});
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

	if (parts.length === 0) {
		sendDownloadProgress(launcher, { progress: 100, currentFile: '', status: 'No packages to download', completed: true });
		return;
	}

	// Reuse TCP connections across all files from the same host
	const AgentClass = host.startsWith('https') ? https.Agent : http.Agent;
	const agent = new AgentClass({ keepAlive: true, maxSockets: 2 });
	const password = config.items.pswd || null;

	// Build URL for a given filename
	const buildUrl = (fileName) => {
		const token = config.items.token || '';
		const cacheBuster = `v=${config.version || Date.now()}`;
		const separator = token ? '&' : '?';
		return `${host}/${fileName}${token ? '?token=' + token : ''}${separator}${cacheBuster}`;
	};

	// Determine extract destination for a given archive path
	const getExtractDir = (filePath) => {
		const archiveName = path.basename(filePath, path.extname(filePath));
		// In debug mode, test archives already have a named top-level folder.
		// In production, archives have loose files — create named subdir.
		return config.debug ? baseDir : path.join(baseDir, archiveName);
	};

	// Download one part and return its result
	const fetchPart = async (i) => {
		const part = parts[i];
		const fileName = typeof part === 'string' ? part : part.name;
		const expectedHash = typeof part === 'object' ? part.hash : null;
		const filePath = path.join(baseDir, fileName);
		const actualHash = await downloadFile(buildUrl(fileName), filePath, !!expectedHash, agent);
		if (downloadAborted) throw new Error('Download aborted');
		return { filePath, fileName, expectedHash, actualHash };
	};

	// Find first part that hasn't been extracted yet (resume support)
	let firstPending = -1;
	for (let i = 0; i < parts.length; i++) {
		const fileName = typeof parts[i] === 'string' ? parts[i] : parts[i].name;
		const extractDir = getExtractDir(path.join(baseDir, fileName));
		if (!config.debug && fs.existsSync(extractDir)) {
			sendDownloadProgress(launcher, {
				progress: Math.round(((i + 1) / parts.length) * 100),
				currentFile: fileName,
				status: `Skipping ${i + 1}/${parts.length} (already installed)...`
			});
		} else {
			firstPending = i;
			break;
		}
	}

	if (firstPending === -1) {
		agent.destroy();
		sendDownloadProgress(launcher, { progress: 100, currentFile: '', status: 'All packages already installed!', completed: true });
		launcher.webContents.send('package-status', checkPackageStatus());
		return;
	}

	// Kick off the first non-skipped download immediately
	sendDownloadProgress(launcher, {
		progress: Math.round((firstPending / parts.length) * 100),
		currentFile: typeof parts[firstPending] === 'string' ? parts[firstPending] : parts[firstPending].name,
		status: `Downloading ${firstPending + 1}/${parts.length}...`
	});
	let pending = fetchPart(firstPending);

	for (let i = firstPending; i < parts.length; i++) {
		if (downloadAborted) {
			agent.destroy();
			sendDownloadProgress(launcher, {
				progress: Math.round((i / parts.length) * 100),
				currentFile: '',
				status: 'Download aborted',
				completed: true
			});
			return;
		}

		// Await the current download
		let result;
		try {
			result = await pending;
		} catch (error) {
			agent.destroy();
			sendDownloadProgress(launcher, {
				progress: Math.round((i / parts.length) * 100),
				currentFile: '',
				status: downloadAborted ? 'Download aborted' : `Error: ${error.message}`,
				completed: true
			});
			return;
		}

		const { filePath, fileName, expectedHash, actualHash } = result;

		// Verify MD5 hash (skipped in debug mode)
		if (expectedHash && actualHash && !config.debug) {
			sendDownloadProgress(launcher, {
				progress: Math.round(((i + 0.3) / parts.length) * 100),
				currentFile: fileName,
				status: `Verifying ${i + 1}/${parts.length}...`
			});
			if (actualHash !== expectedHash) {
				if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
				agent.destroy();
				sendDownloadProgress(launcher, {
					progress: Math.round((i / parts.length) * 100),
					currentFile: fileName,
					status: `Error: File integrity check failed for ${fileName}`,
					completed: true
				});
				return;
			}
		}

		// Pipeline: start fetching the next pending part NOW, before extraction begins
		let nextLabel = '';
		if (i + 1 < parts.length && !downloadAborted) {
			let j = i + 1;
			// Skip parts that are already extracted
			while (j < parts.length) {
				const fn = typeof parts[j] === 'string' ? parts[j] : parts[j].name;
				const ed = getExtractDir(path.join(baseDir, fn));
				if (config.debug || !fs.existsSync(ed)) break;
				sendDownloadProgress(launcher, {
					progress: Math.round(((j + 1) / parts.length) * 100),
					currentFile: fn,
					status: `Skipping ${j + 1}/${parts.length} (already installed)...`
				});
				j++;
			}
			if (j < parts.length) {
				nextLabel = typeof parts[j] === 'string' ? parts[j] : parts[j].name;
				pending = fetchPart(j);
				i = j - 1; // loop will i++ to j
			} else {
				pending = Promise.resolve(null);
			}
		}

		const suffix = nextLabel ? ` (Downloading ${nextLabel} in background)` : '';
		sendDownloadProgress(launcher, {
			progress: Math.round(((i + 0.5) / parts.length) * 100),
			currentFile: fileName,
			status: `Extracting ${i + 1}/${parts.length}...${suffix}`
		});

		// Extract current archive
		try {
			await extractArchive(sevenZipPath, filePath, getExtractDir(filePath), password);
		} catch (error) {
			agent.destroy();
			sendDownloadProgress(launcher, {
				progress: Math.round((i / parts.length) * 100),
				currentFile: fileName,
				status: `Error: ${error.message}`,
				completed: true
			});
			return;
		}

		if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
	}

	agent.destroy();
	sendDownloadProgress(launcher, {
		progress: 100,
		currentFile: '',
		status: 'Download completed!',
		completed: true
	});

	const status = checkPackageStatus();
	launcher.webContents.send('package-status', status);
}

/**
 * Download a file from URL, optionally calculating MD5 hash during download.
 * Handles redirects and abort signals.
 */
function downloadFile(fileUrl, filePath, calculateHash = false, agent = null) {
	return new Promise((resolve, reject) => {
		const protocol = fileUrl.startsWith('https') ? https : http;
		const file = fs.createWriteStream(filePath, { highWaterMark: 4 * 1024 * 1024 });
		const hash = calculateHash ? crypto.createHash('md5') : null;
		let settled = false;
		let abortedMid = false;

		const cleanup = () => {
			try { file.destroy(); } catch (_) { }
			fs.unlink(filePath, () => { });
		};

		const settle = (fn) => {
			if (!settled) { settled = true; fn(); }
		};

		const reqOptions = agent ? { agent } : {};
		const request = protocol.get(fileUrl, reqOptions, (response) => {
			response.setTimeout(30000, () => request.destroy(new Error('Connection timed out')));
			// Follow redirects
			if ([301, 302, 307, 308].includes(response.statusCode)) {
				file.destroy();
				fs.unlink(filePath, () => { });
				downloadFile(response.headers.location, filePath, calculateHash, agent)
					.then(h => settle(() => resolve(h)))
					.catch(e => settle(() => reject(e)));
				return;
			}

			if (response.statusCode !== 200) {
				cleanup();
				settle(() => reject(new Error(`Failed to download: ${response.statusCode}`)));
				return;
			}

			response.on('data', (chunk) => {
				if (downloadAborted) {
					abortedMid = true;
					request.destroy();
					return;
				}
				if (hash) hash.update(chunk);
			});

			response.pipe(file);

			file.on('finish', () => {
				if (abortedMid || downloadAborted) {
					cleanup();
					settle(() => reject(new Error('Download aborted')));
				} else {
					const md5Hash = hash ? hash.digest('hex') : null;
					settle(() => resolve(md5Hash));
				}
			});

			file.on('error', (error) => {
				cleanup();
				settle(() => reject(error));
			});

		}).on('error', (error) => {
			cleanup();
			settle(() => reject(error));
		});
	});
}

/**
 * Extract archive (zip, 7z, rar, iso, etc.) using 7z.exe.
 */
function extractArchive(sevenZipPath, archivePath, outputDir, password = null, retries = 3, retryDelay = 2000) {
	return new Promise((resolve, reject) => {
		// Ensure output directory exists before extracting
		try {
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}
		} catch (mkdirError) {
			reject(new Error(`Failed to create output directory: ${mkdirError.message}`));
			return;
		}

		const args = ['x', archivePath, `-o${outputDir}`, '-y'];

		// Add password if provided
		if (password) {
			args.push(`-p${password}`);
		}

		const attempt = (attemptsLeft) => {
			exec(sevenZipPath, args, (error, stdout, stderr) => {
				if (!error) {
					resolve();
					return;
				}

				const detail = (stderr && stderr.trim()) ? stderr.trim() : error.message;
				const isLocked = detail.includes('being used by another process') ||
					detail.includes('utilise par un autre processus') ||
					detail.includes('Cannot open output file') ||
					detail.includes('Cannot delete output file');

				if (isLocked && attemptsLeft > 1) {
					// File locked by another process — wait and retry
					setTimeout(() => attempt(attemptsLeft - 1), retryDelay);
				} else {
					reject(new Error(`Extraction failed: ${detail}`));
				}
			});
		};

		attempt(retries);
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
					progress: 10 + Math.round(progress * 80),
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
 * Handles redirects and abort signals without pipe/data-listener race conditions.
 */
function downloadFileWithProgress(fileUrl, filePath, onProgress, downloadType = 'item') {
	return new Promise((resolve, reject) => {
		const protocol = fileUrl.startsWith('https') ? https : http;
		const file = fs.createWriteStream(filePath, { highWaterMark: 4 * 1024 * 1024 });
		let settled = false;
		let abortedMid = false;

		const cleanup = () => {
			try { file.destroy(); } catch (_) { }
			fs.unlink(filePath, () => { });
		};

		const settle = (fn) => {
			if (!settled) { settled = true; fn(); }
		};

		const isAborted = () => {
			if (downloadType === 'ai') return aiDownloadAborted;
			return itemDownloadAborted;
		};

		const request = protocol.get(fileUrl, (response) => {
			response.setTimeout(30000, () => request.destroy(new Error('Connection timed out')));
			// Follow redirects
			if ([301, 302, 307, 308].includes(response.statusCode)) {
				file.destroy();
				fs.unlink(filePath, () => { });
				downloadFileWithProgress(response.headers.location, filePath, onProgress, downloadType)
					.then(() => settle(resolve))
					.catch(e => settle(() => reject(e)));
				return;
			}

			if (response.statusCode !== 200) {
				cleanup();
				settle(() => reject(new Error(`Failed to download: ${response.statusCode}`)));
				return;
			}

			const totalSize = parseInt(response.headers['content-length'], 10);
			let downloadedSize = 0;

			// Track progress and abort via data events; writing handled by pipe
			response.on('data', (chunk) => {
				if (isAborted()) {
					abortedMid = true;
					request.destroy();
					return;
				}
				downloadedSize += chunk.length;
				if (totalSize && onProgress) {
					onProgress(downloadedSize / totalSize);
				}
			});

			response.pipe(file);

			file.on('finish', () => {
				if (abortedMid || isAborted()) {
					cleanup();
					settle(() => reject(new Error('Download aborted')));
				} else {
					settle(resolve);
				}
			});

			file.on('error', (error) => {
				cleanup();
				settle(() => reject(error));
			});

		}).on('error', (error) => {
			cleanup();
			settle(() => reject(error));
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
	isAdmin,
	relaunchAsAdmin,
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
	abortAIDownload,
	loadSettings,
	saveSettings
};
