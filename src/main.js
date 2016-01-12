const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var core = null;
var mainWindow = null;

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  // Parse command line args
  var opts = require('nomnom')
    .script('oudjo')
    .options({
      headless: {
        abbr: 'l',
        flag: true,
        help: 'Start oudjo server without GUI'
      }
    })
    .parse();

  // Create 'core' window (player)
  core = new BrowserWindow({
    show: false
  });
  core.loadURL(`file://${__dirname}/core.html`);

  // Create 'main' window (user interface)
  if (!opts.headless) {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      'min-width': 650,
      'min-height': 374,
      center: true
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
      // When main window closes, close core window and by that the whole app
      if (core && core !== null) {
        core.close();
      }

      mainWindow = null;
    });
  } else {
    console.log('oudjo is running in headless mode');
  }

  // Open dev tools
  // TODO: Remove this before the release
  core.webContents.openDevTools();
  if (!opts.headless) {
    mainWindow.webContents.openDevTools();
  }

  core.on('closed', () => {
    core = null;
  });
});
