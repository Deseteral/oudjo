console.time('Core initialization');

const remote = require('electron').remote;

import { Settings } from './src/settings';
import { Database } from './src/database';
import { Player } from './src/player';

let settings;
let database;
let player;

window.addEventListener('WebComponentsReady', () => {
  console.info('UI loaded');

  let app = document.querySelector('#app');

  let $masterTab = document.querySelector('#master-tab');
  let $menuDrawer = document.querySelector('#menu-drawer');
  let $drawerPanel = document.querySelector('paper-drawer-panel');
  let $toolbar = document.querySelector('paper-toolbar');
  let $tabs = document.querySelector('paper-tabs');
  let $buttonPlay = document.querySelector('#bar-button-play');
  let $volumeSlider = document.querySelector('#bar-slider-volume');
  let $buttonMute = document.querySelector('#bar-button-mute');

  // Load settings
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

  // Load song database
  database = new Database(settings.getValue('database-path'));
  database.load()
    .then(() => {
      player = new Player(
        document.querySelector('audio'),
        settings.getValue('database-path')
      );

      player.eventEmitter.addListener('song-changed', () => {
        let song = player.getCurrentSong();

        app['player-song-title'] = song.title;
        app['player-song-info'] = `${song.artist} - ${song.album}`;
        app['player-song-id'] = song._id;
      });

      player.eventEmitter.addListener('playback-state-changed', () => {
        if (player.isPlaying()) {
          $buttonPlay.icon = 'av:pause-circle-filled';
        } else {
          $buttonPlay.icon = 'av:play-circle-filled';
        }
      });

      player.eventEmitter.addListener('playback-progress', () => {
        app['player-playback-progress'] =
          parseInt(player.playbackProgress * 10000);
      });

      player.eventEmitter.addListener('volume-changed', () => {
        if (!$volumeSlider.dragging) {
          $volumeSlider.value = parseInt(player.getVolume() * 100);
        }

        let newVolume = player.getVolume();

        if (newVolume === 0) {
          $buttonMute.icon = 'av:volume-off';
        } else if (newVolume === 1) {
          $buttonMute.icon = 'av:volume-up';
        } else if (newVolume < 0.5) {
          $buttonMute.icon = 'av:volume-mute';
        } else {
          $buttonMute.icon = 'av:volume-down';
        }
      });

      app._buttonPlayClick = () => player.play();
      app._buttonNextClick = () => player.next();
      app._buttonPreviousClick = () => player.previous();
      app._buttonMuteClick = () => player.mute();
      app._buttonRepeatClick = () => player.toggleRepeat();

      console.timeEnd('Core initialization');

      // TODO: Remove this, DEBUG only
      //       Add all song to the queue
      database.storage.library.find({}, (err, docs) => player.addToQueue(docs));
    });

  $menuDrawer.addEventListener('iron-select', () => {
    // Close the drawer when user selects a page
    $drawerPanel.closeDrawer();
  });

  $masterTab.addEventListener('iron-select', () => {
    // Only show tabs when user is on library page
    if (app['master-tab-selection'] === 'drawer-menu-library') {
      $toolbar.className = 'medium-tall x-scope paper-toolbar-0 animate';
      $tabs.style.opacity = '1';
      $tabs.style['pointer-events'] = 'auto';
    } else {
      $toolbar.className = 'x-scope paper-toolbar-0 animate';
      $tabs.style.opacity  = '0';
      $tabs.style['pointer-events'] = 'none';
    }
  });

  // Handle changes to volume slider
  $volumeSlider.addEventListener('immediate-value-change', () => {
    player.setVolume($volumeSlider.immediateValue / 100);
  });

  $volumeSlider.addEventListener('change', () => {
    player.setVolume($volumeSlider.immediateValue / 100);
  });

  // When search bar value changes
  app._searchBarValueChanged = () => {
    let query = app['search-bar-query'];

    if (query.length === 0) {
      app['master-tab-selection'] = 'drawer-menu-library';
    } else {
      app['master-tab-selection'] = 'drawer-menu-search';
    }
  };

  // Setup default pages
  app['master-tab-selection'] = 'drawer-menu-my-oudjo';
  app['library-tab-selection'] = 'library-songs';

  app['player-song-title'] = 'oudjo';
  app['player-song-info'] = 'music player';
});

function getAlbumArtBase64(songId) {
  return new Promise((fulfill, reject) => {
    database.getAlbumArt(songId)
      .then((picture) => fulfill(picture.data.toString('base64')))
      .catch((err) => reject(err));
  });
}

console.log(`%coudjo v${require('../package.json').version}`,
  'font-size: 48px; background: ' +
    '-webkit-linear-gradient(top, #CDDC39 0%, #8BC34A 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');
