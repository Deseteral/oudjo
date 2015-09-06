var app = require('app');
var ipc = require('ipc');
var globalShortcut = require('global-shortcut');
var BrowserWindow = require('browser-window');
var Settings = require('./src/settings');

var settings = null;

var core = null;
var mainWindow = null;

app.on('ready', function() {

  // Load settings from file
  var settingsFilePath = app.getPath('userData') + '/settings.json';
  settings = new Settings(settingsFilePath);
  settings.loadFromFile();

  // Create 'core' window (player)
  core = new BrowserWindow({
    show: false
  });
  core.loadUrl('file://' + __dirname + '/core.html');

  // Create 'main' window (user interface)
  mainWindow = new BrowserWindow({
    width: settings.values['window-width'],
    height: settings.values['window-height'],
    'min-width': 650,
    'min-height': 374,
    center: true
  });

  // Display loading screen
  mainWindow.loadUrl('file://' + __dirname + '/loading.html');

  // When Core is ready
  ipc.on('core-server-ready', function() {
    // Load proper UI
    mainWindow.loadUrl('http://localhost:' + settings.values.port);
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
    settings.saveToFile();
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

ipc.on('settings-get', function(event) {
  event.returnValue = settings.values;
});

ipc.on('settings-get-value', function(event, arg) {
  event.returnValue = settings.values[arg];
});

ipc.on('settings-change', function(event, arg) {
  settings.values[arg.name] = arg.value;
  event.returnValue = null;
});

ipc.on('settings-save', function(event) {
  settings.saveToFile();
  event.returnValue = null;
});
