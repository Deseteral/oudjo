const electron = require('electron');
const ipc = electron.ipcRenderer;

window.addEventListener('WebComponentsReady', () => {
  let app = document.querySelector('#app');

  ipc.on('player-song-changed', (event, song) => {
    app['song-album-id'] = song._id;
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
    ipc.on('get-album-art-base-64-response', (event, arg) => {
      fulfill(arg);
    });
  });
}
