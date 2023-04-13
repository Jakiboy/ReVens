/**
 * Author  : Jihad Sinnaour (Jakiboy)
 * package : ReVen | Reverse Engineering Toolkit AIO
 * version : 1.0.0
 */

'use strict';

/**
 * Dependencies.
 */
const Shell = require('electron').shell;
const Path = require('path');
const Fs = require('fs');
const Exec = require('child_process').execFile; // Execute file with args
// const Exec = require('child_process').exec; // Execute cmd with args
// const Exec = require('child_process').spawn; // Spawning .bat and .cmd

/**
 * Globals.
 */
var baseDir = false;

/**
 * Ready event.
 */
$(document).ready(function () {
  setDebug();
  setBaseDir();
  reset();
  checkConfiguration();
  open();
});

/**
 * Check setup.
 */
function checkConfiguration() {

  log('Checking configuration');

  setTimeout(function () {

    const dir = getPath('bin');
    Fs.readdir(formatPath(dir), function (err, files) {
      if (err || !files.length) {
        log('Error: Missing packages');
        removeLoading();

      } else {
        log('Ready');
        enable();
        removeLoading();
      }
    });

  }, 2000);
}

/**
 * Reset interface.
 */
function reset() {
  doLoading();
  $(document).find('.content-wrapper .btn').addClass('disabled');
}

/**
 * Enable interface.
 */
function enable() {
  // Set id
  $('.content-wrapper .btn').each(function () {
    const id = slugify($(this).text());
    $(this).attr('data-id', id);
  });

  // Set path
  const file = Path.join(__dirname, '/config/path.json');
  Fs.readFile(formatPath(file), "utf8", (err, json) => {
    if (!err) {
      const config = JSON.parse(json);
      $.each(config, function (id, value) {
        const btn = '.content-wrapper .btn[data-id="' + id + '"]';
        if ($(btn).length) {
          $(btn).removeClass('disabled');
          $(btn).attr('data-path', value.path);
          $(btn).attr('data-type', value.type);
          if (value.type == 'cli') {
            $(btn).attr('data-cmd', value.cmd);
          }
        }
      });

    } else {
      log(err);
      return;
    }
  });
}

/**
 * Open package.
 */
function open() {
  $(document).on('click', '.content-wrapper .btn:not(.disabled)', function (e) {
    e.preventDefault();

    const t = $(this).attr('data-type');
    const p = $(this).attr('data-path');
    const base = getPath('bin');
    const launcher = formatPath(base + p);

    if (t == 'exe') {
      Shell.openPath(launcher);

    } else if (t == 'cli') {
      const bat = buildBat(launcher, $(this));
      Shell.openPath(bat);

    } else if (t == 'xm') {
      const player = 'Patching/Sound/FastTracker 2/x64/ft2-clone-win64.exe';
      const l = base + player;
      const file = base + p;
      Exec(formatPath(l), [formatPath(file)]);
    }
  });
}

/**
 * Do loading.
 */
function doLoading() {
  $(document).find('.logger').addClass('loading');
}

/**
 * Remove loading.
 */
function removeLoading() {
  $(document).find('.logger').removeClass('loading');
}

/**
 * Log message.
 */
function log(msg) {
  $(document).find('.logger .status').html(msg);
}

/**
 * Slugify string.
 */
function slugify(string) {
  string = string.trim();
  string = string.toLowerCase();
  string = string.replace(/[^\w ]+/g, '');
  string = string.replace(/ +/g, '-');
  return string;
}

/**
 * Debug cmd.
 */
function debugCMD(cmd) {

  // STDOUT
  cmd.stdout.setEncoding('utf8');
  cmd.stdout.on('data', (data) => {
    data = data.toString();
    console.log(data);
  });

  // STDERR
  cmd.stderr.setEncoding('utf8');
  cmd.stderr.on('data', (data) => {
    console.log(data);
  });

  // ERROR
  cmd.on('error', (err) => {
    console.log(err);
  });

  // CLOSE
  cmd.on('close', (code) => {
    console.log(code);
  });

}

/**
 * Get basename.
 */
function getBasename(string) {
  let base = new String(string).
    substring(string.lastIndexOf('/') + 1);
  if (base.lastIndexOf('.') !== -1) {
    base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
}

/**
 * Get path.
 */
function getPath(dir) {
  if ( baseDir !== false ) {
    return Path.join(baseDir, dir + '/');
  }
  const root = Path.dirname(
    Path.dirname(__dirname)
  );
  return Path.join(root, dir + '/');
}

/**
 * Format path.
 */
function formatPath(path) {
  // CMD Escape space:
  // path.replace(/\s/g, '^ ');
  return path.replace(/\//g, '\\');
}

/**
 * Build bat.
 */
function buildBat(launcher, object) {
  var args = object.attr('data-cmd');
  var basename = getBasename(launcher);
  var bat = launcher.replace('.exe', '.bat');
  Fs.readFile(bat, "utf8", (err, data) => {
    if (err || !data) {
      let content = basename + '.exe ' + args;
      content += '\n';
      content += 'PAUSE';
      Fs.writeFile(bat, content, (err) => {
        if (err) {
          log(err);
        }
      });
    }
  });
  return bat;
}

/**
 * Set debug.
 */
function setDebug() {
  const file = Path.join(__dirname, '/config/app.json');
  Fs.readFile(formatPath(file), "utf8", (err, json) => {
    if (!err) {
      const config = JSON.parse(json);
      if (config.debug == true) {
        let btn = '<a href="#" class="btn btn-primary" data-tooltip="Debug" ';
        btn += 'data-id="debug" data-path=".debug/debug.txt" data-type="exe">';
        btn += '<i class="icon-hourglass"></i> Debug';
        btn += '</a>';
        const tab = $('.content-wrapper .tab-content .tab-pane:first-child');
        const wrapper = tab.find('.section-container .section-wrapper:first-child .button-wrapper');
        wrapper.prepend(btn);
      }
    }
  });
}

/**
 * Set bas dir.
 */
function setBaseDir() {
  const file = Path.join(__dirname, '/config/app.json');
  Fs.readFile(formatPath(file), "utf8", (err, json) => {
    if (!err) {
      const config = JSON.parse(json);
      baseDir = config.baseDir;
    }
  });
}
