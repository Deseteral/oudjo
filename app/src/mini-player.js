const electron = require('electron');
const ipc = electron.ipcRenderer;

window.addEventListener('WebComponentsReady', () => {
  let app = document.querySelector('#app');

  let $infoBar = document.querySelector('#info-bar');
  let $playerBar = document.querySelector('#player-bar');
  let $buttonPlay = document.querySelector('#bar-button-play');

  // Control button on click functions
  app._buttonPlayClick = () => ipc.send('player-play');
  app._buttonPreviousClick = () => ipc.send('player-previous');
  app._buttonNextClick = () => ipc.send('player-next');

  // Update title, artist and cover art when the song changes
  ipc.on('player-song-changed', (event, song) => {
    app['song-album-id'] = song._id;
    app['song-title'] = song.title;
    app['song-artist'] = song.artist;
  });

  // When the player starts or stops playing, update the icon of play button
  ipc.on('player-playback-state-changed', (event, isPlaying) => {
    if (isPlaying) {
      $buttonPlay.icon = 'av:pause-circle-filled';
    } else {
      $buttonPlay.icon = 'av:play-circle-filled';
    }
  });

  // Show info and player bar
  ipc.on('window-focus', () => {
    $infoBar.style.opacity = '1';
    $playerBar.style['-webkit-transition'] =
      'transform 0.225s cubic-bezier(0.0, 0.0, 0.2, 1)';
    $playerBar.style.transform = 'translateY(0)';
  });

  // Hide info and player bar
  ipc.on('window-blur', () => {
    $infoBar.style.opacity = '0';
    $playerBar.style['-webkit-transition'] =
      'transform 0.195s cubic-bezier(0.4, 0.0, 1, 1))';
    $playerBar.style.transform = 'translateY(80px)';
  });
});

// Hide the window instead of closing it
window.onbeforeunload = (e) => {
  ipc.send('mini-player-hide');
  e.returnValue = false;
};

/* exported getAlbumArtBase64 */
function getAlbumArtBase64(songId) {
  return new Promise((fulfill) => {
    ipc.send('get-album-art-base-64', songId);
    ipc.once('get-album-art-base-64-response', (event, arg) => {
      fulfill(arg);
    });
  });
}
