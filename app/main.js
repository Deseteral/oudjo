const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

let mainWindow = null;
let miniPlayerWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  // Main window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 854,
    'min-width': 650,
    'min-height': 374
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;

    if (miniPlayerWindow !== null) {
      miniPlayerWindow.destroy();
    }
  });

  // Mini-player window
  miniPlayerWindow = new BrowserWindow({
    width: 256,
    height: 256,
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false
  });
  miniPlayerWindow.setMenu(null);
  miniPlayerWindow.loadURL('file://' + __dirname + '/mini-player.html');

  miniPlayerWindow.webContents.openDevTools();

  miniPlayerWindow.on('closed', () => miniPlayerWindow = null);
  miniPlayerWindow.onbeforeunload = (e) => {
    console.log('dont close');
    e.returnValue = false;
  };

  // Bind IPC events
  ipc.on('mini-player-show', () => {
    mainWindow.hide();
    if (miniPlayerWindow !== null) {
      miniPlayerWindow.show();
    }
  });

  ipc.on('mini-player-hide', () => {
    mainWindow.show();
    if (miniPlayerWindow !== null) {
      miniPlayerWindow.hide();
    }
  });

  ipc.on('player-song-changed', (event, arg) => {
    miniPlayerWindow.webContents.send('player-song-changed', arg);
  });

  ipc.on('get-album-art-base-64', (event, arg) => {
    mainWindow.webContents.send('get-album-art-base-64', arg);
  });

  ipc.on('get-album-art-base-64-response', (event, arg) => {
    miniPlayerWindow.webContents.send('get-album-art-base-64-response', arg);
  });

  // Register global key shortcuts
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('player-play');
  });

  globalShortcut.register('MediaStop', () => {
    mainWindow.webContents.send('player-stop');
  });

  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('player-next');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('player-previous');
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
