var app = require('app');
var ipc = require('ipc');
var globalShortcut = require('global-shortcut');
var BrowserWindow = require('browser-window');

var core = null;
var mainWindow = null;

var coreInfo = null;

app.on('ready', function() {

  // Create 'core' window (player)
  core = new BrowserWindow({
    show: false
  });
  core.loadUrl('file://' + __dirname + '/core.html');

  // Create 'main' window (user interface)
  mainWindow = new BrowserWindow({
    width: 640,
    height: 400,
    'min-width': 650,
    'min-height': 374,
    center: true
  });

  // Display loading screen
  mainWindow.loadUrl('file://' + __dirname + '/loading.html');

  // When Core is ready
  ipc.on('core-server-ready', function() {
    // Load proper UI
    mainWindow.setSize(coreInfo.width, coreInfo.height);
    mainWindow.center();
    mainWindow.loadUrl('http://localhost:' + coreInfo.port);
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
    core.webContents.send('settings-save');
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

ipc.on('core-info-loaded', function(event, arg) {
  coreInfo = arg;
  event.returnValue = null;
});
