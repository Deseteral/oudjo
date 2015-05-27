var app = require('app');
var ipc = require('ipc');
var fs = require('fs');
var BrowserWindow = require('browser-window');
var defaults = require('./src/defaults');

var settings = null;
var settingsFilePath = null;

var core = null;
var mainWindow = null;

app.on('ready', function() {
  settingsFilePath = app.getPath('userData') + '/settings.json';
  loadSettings();

  core = new BrowserWindow({
    show: false
  });
  core.loadUrl('file://' + __dirname + '/core.html');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    center: true
  });

  ipc.on('core-server-ready', function() {
    mainWindow.loadUrl('http://localhost:' + settings.port);
    mainWindow.toggleDevTools();
  });

  core.toggleDevTools();

  mainWindow.on('close', function() {
    saveSettings();
  });

  mainWindow.on('closed', function() {
    if (core && core !== null) {
      core.close();
    }

    mainWindow = null;
  });

  core.on('closed', function() {
    core = null;
  });
});

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
