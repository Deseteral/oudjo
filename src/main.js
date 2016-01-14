const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;

var core = null;
var mainWindow = null;
var opts = null;

app.on('ready', () => {
  // Parse command line args
  opts = require('nomnom')
    .script('oudjo')
    .options({
      headless: {
        abbr: 'l',
        flag: true,
        help: 'Start oudjo server without GUI'
      }
    })
    .parse();

  // Create 'core' window (player server)
  core = new BrowserWindow({
    show: false
  });
  core.loadURL(`file://${__dirname}/core.html`);

  // Open core dev tools
  // TODO: Remove this before the release
  core.webContents.openDevTools();

  core.on('closed', () => {
    core = null;
  });
});

// When core is ready with server running, connect and display UI
ipcMain.on('core-server-ready', (event, info) => {
  // Create 'main' window (user interface)
  if (!opts.headless) {
    mainWindow = new BrowserWindow({
      width: info.width,
      height: info.height,
      'min-width': 650,
      'min-height': 374,
      center: true
    });

    mainWindow.loadURL(`http://localhost:${info.port}`);
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
      // When main window closes, close core window and by that the whole app
      if (core && core !== null) {
        core.close();
      }

      mainWindow = null;
    });

    // Open main window dev tools
    // TODO: Remove this before the release
    mainWindow.webContents.openDevTools();
  } else {
    console.log('oudjo is running in headless mode');
  }
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
