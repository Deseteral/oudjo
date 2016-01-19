const express = require('express');
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;

const Settings = require('./settings');
const Database = require('./database');

var httpServer = express();
var settings = null;
var database = null;

function ready() {
  // Print pretty info into the console
  console.log('%coudjo -- core', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');

  let setupSettingsPromise = new Promise((resolve) => {
    let userDataPath = remote.require('app').getPath('userData');

    // TODO: use path.combine
    let settingsFilePath = `${userDataPath}/settings.json`;

    settings = new Settings(settingsFilePath);
    settings.loadFromFile();

    console.log('Loaded app settings');
    console.log(settings);

    resolve();
  });

  let setupDatabasePromise = new Promise((resolve, reject) => {
    database = new Database();

    let settingsDbPath = settings.getProperty('database-path');
    if (settingsDbPath !== '') {
      database.open(settingsDbPath, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    } else {
      changeDatabasePath((path) => {
        database.open(path, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      });
    }
  });

  let _setupHttpServer = () => {
    // Serving static assets
    // TODO: Use path.combine
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

      console.log(`oudjo server listening on port ${info.port}`);
      console.log('Finished core initialization');
    });
  };

  Promise
    .all([setupSettingsPromise, setupDatabasePromise])
    .then(() => {
      _setupHttpServer();
    })
    .catch(console.error);
}

function changeDatabasePath(callback) {
  const dialog = remote.require('electron').dialog;

  let options = {
    title: 'Open database',
    properties: ['openDirectory']
  };

  dialog.showOpenDialog(remote.getCurrentWindow(), options, (paths) => {
    if (paths) {
      // Save new path to settings
      settings.setProperty('database-path', paths[0]);
      settings.saveToFile();

      if (callback) {
        callback(paths[0]);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', ready);
