var app = require('app');
var ipc = require('ipc');
var globalShortcut = require('global-shortcut');
var BrowserWindow = require('browser-window');

var core = null;
var splashWindow = null;
var mainWindow = null;

var coreInfo = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  // Create 'core' window (player)
  core = new BrowserWindow({
    show: false
  });
  core.loadUrl('file://' + __dirname + '/core.html');

  // Open devtools for Core window
  core.openDevTools();

  // Kill process
  core.on('closed', function() {
    core = null;
  });

  // Create and display splash screen
  splashWindow = new BrowserWindow({
    width: 640,
    height: 400,
    frame: false,
    center: true
  });
  splashWindow.setMenu(null);
  splashWindow.loadUrl('file://' + __dirname + '/splash-screen.html');
  splashWindow.toggleDevTools();

  // Dereference splash window
  splashWindow.on('closed', function() {
    splashWindow = null;
  });

  // When Core is ready
  ipc.on('core-server-ready', function() {
    // Create 'main' window (user interface)
    mainWindow = new BrowserWindow({
      width: coreInfo.width,
      height: coreInfo.height,
      'min-width': 650,
      'min-height': 374,
      center: true
    });
    mainWindow.setMenu(null);
    mainWindow.loadUrl('http://localhost:' + coreInfo.port);
    mainWindow.toggleDevTools();

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

    // Close splash screen
    splashWindow.close();

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
});

ipc.on('core-info-loaded', function(event, arg) {
  coreInfo = arg;
  event.returnValue = null;
});
