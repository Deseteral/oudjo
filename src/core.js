const express = require('express');
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const Settings = require('./settings');

var httpServer = express();
var settings = null;

// Print pretty info into the console
console.log('%coudjo -- core', 'font-size: x-large; background: ' +
  '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%);' +
  '-webkit-background-clip: text;' +
  '-webkit-text-fill-color: transparent;');

// Load settings from file
let userDataPath = remote.require('app').getPath('userData');
let settingsFilePath = `${userDataPath}/settings.json`;

settings = new Settings(settingsFilePath);
settings.loadFromFile();
console.log('Loaded app settings');
console.log(settings);

// Serving static assets
httpServer.use('/', express.static(`${__dirname}/app`));
httpServer.use('/bower_components', express.static(`${__dirname}/../bower_components`));
httpServer.use('/resources', express.static(`${__dirname}/../resources`));

httpServer.listen(settings.getProperty('port'), () => {

  // Send core ready status and settings information to the main process
  let info = {
    width: settings.getProperty('window-width'),
    height: settings.getProperty('window-height'),
    port: settings.getProperty('port')
  };

  ipcRenderer.send('core-server-ready', info);

  // Finish core initialization
  console.log('Finished core initialization');
  console.log(`oudjo server listening on port ${info.port}`);
});
