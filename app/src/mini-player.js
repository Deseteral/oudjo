const electron = require('electron');
const ipc = electron.ipcRenderer;

window.addEventListener('WebComponentsReady', () => {
  let app = document.querySelector('#app');

  app._buttonPlayClick = () => ipc.send('player-play');
  app._buttonPreviousClick = () => ipc.send('player-previous');
  app._buttonNextClick = () => ipc.send('player-next');

  ipc.on('player-song-changed', (event, song) => {
    app['song-album-id'] = song._id;
    app['song-title'] = song.title;
    app['song-artist'] = song.artist;
  });
});

// Hide the window instead of closing it
window.onbeforeunload = (e) => {
  ipc.send('mini-player-hide');
  e.returnValue = false;
};

function getAlbumArtBase64(songId) {
  return new Promise((fulfill) => {
    ipc.send('get-album-art-base-64', songId);
    ipc.once('get-album-art-base-64-response', (event, arg) => {
      fulfill(arg);
    });
  });
}
