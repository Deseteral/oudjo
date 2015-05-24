var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    center: true
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.toggleDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
