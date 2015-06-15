Polymer({
  is: 'oudjo-bar',
  _lastSongId: null,

  ready: function() {
    this.songTitle = 'oudjo';

    socket.on('player', function(details) {
      switch (details.action) {
        case 'get-status':
          this._updateStatus(details.status);
          break;
      }
    }.bind(this));
  },

  _updateStatus: function(status) {
    // If there's no currently loaded song
    if (status.song === undefined) {
      this.songTitle = 'oudjo';
      this.songArtist = '';

      this.$['album-art'].songId = null;
    } else if (status.song._id !== this._lastSongId) { // If the song has changed
      this.songTitle = status.song.title;
      this.songArtist = status.song.artist;

      this.$['album-art'].songId = status.song._id;

      this._lastSongId = status.song._id;
    }

    // Update play button icon
    if (status.isPaused) {
      this.$['icon-play'].icon = 'av:play-arrow';
    } else {
      this.$['icon-play'].icon = 'av:pause';
    }
  },

  _buttonPlayClick: function() {
    socket.emit('player', { action: 'play' });
  }
});
