var app = require('app');
var ipc = require('ipc');
var globalShortcut = require('global-shortcut');
var fs = require('fs');
var BrowserWindow = require('browser-window');
var defaults = require('./src/defaults');

var settings = null;
var settingsFilePath = null;

var core = null;
var mainWindow = null;

app.on('ready', function() {

  // Load settings from file
  settingsFilePath = app.getPath('userData') + '/settings.json';
  loadSettings();

  // Create 'core' window (player)
  core = new BrowserWindow({
    show: false
  });
  core.loadUrl('file://' + __dirname + '/core.html');

  // Create 'main' window (user interface)
  mainWindow = new BrowserWindow({
    width: settings.windowWidth,
    height: settings.windowHeight,
    'min-width': 650,
    'min-height': 374,
    center: true
  });

  // Display loading screen
  mainWindow.loadUrl('file://' + __dirname + '/loading.html');

  // When Core is ready
  ipc.on('core-server-ready', function() {
    // Load proper UI
    mainWindow.loadUrl('http://localhost:' + settings.port);
    mainWindow.toggleDevTools();

    // Register global key shortcuts
    globalShortcut.register('MediaPlayPause', function() {
      core.webContents.send('core-player-play');
    });

    globalShortcut.register('MediaStop', function() {
      core.webContents.send('core-player-stop');
    });

    globalShortcut.register('MediaNextTrack', function() {
      core.webContents.send('core-player-next');
    });

    globalShortcut.register('MediaPreviousTrack', function() {
      core.webContents.send('core-player-previous');
    });
  });

  // Open devtools for Core window
  core.toggleDevTools();

  // Save settings before main window closes
  mainWindow.on('close', function() {
    saveSettings();
  });

  // When main window is closed, close Core window
  mainWindow.on('closed', function() {
    if (core && core !== null) {
      core.close();
    }

    mainWindow = null;
  });

  // Kill process
  core.on('closed', function() {
    core = null;
  });
});

// Load settings from file
function loadSettings() {
  try {
    settings = JSON.parse(fs.readFileSync(settingsFilePath));
  } catch (err) {
    // If file doesn't exist - create default settings
    settings = {
      windowWidth: defaults.windowWidth,
      windowHeight: defaults.windowHeight,
      port: defaults.port
    };

    saveSettings();
  }
}

// Save settings to file
function saveSettings() {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}

ipc.on('settings-get', function(event) {
  event.returnValue = settings;
});

ipc.on('settings-change', function(event, arg) {
  settings = arg;
  event.returnValue = null;
});

ipc.on('settings-save', function(event) {
  saveSettings();
  event.returnValue = null;
});
