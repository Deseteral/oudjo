console.time('Core initialization');

const remote = require('electron').remote;

import { Settings } from './src/settings';
import { Database } from './src/database';
import { Player } from './src/player';

let settings;
let database;
let player;

document.addEventListener('DOMContentLoaded', () => {
  console.info('UI loaded');

  settings = new Settings();
  settings.load();

  // If database path is not saved, open directory finder dialog
  if (settings.getValue('database-path') === '') {
    let dialog = remote.require('electron').dialog;

    let options = {
      title: 'Select your music directory',
      properties: ['openDirectory']
    };

    let dbPaths = dialog.showOpenDialog(remote.getCurrentWindow(), options);

    if (dbPaths === undefined) {
      dialog.showErrorBox('Error!', 'You have to select your music directory!');
      window.close();
    }

    settings.setValue('database-path', dbPaths[0]);
    settings.save();
  }

  database = new Database(settings.getValue('database-path'));
  database.load()
    .then(() => {
      player = new Player(
        document.querySelector('audio'),
        settings.getValue('database-path')
      );
      console.timeEnd('Core initialization');
    });
});

console.log(`%coudjo v${require('../package.json').version}`,
  'font-size: 48px; background: ' +
    '-webkit-linear-gradient(top, #CDDC39 0%, #8BC34A 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');
