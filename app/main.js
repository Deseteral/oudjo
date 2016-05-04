const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 854,
    'min-width': 650,
    'min-height': 374
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => mainWindow = null);

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
