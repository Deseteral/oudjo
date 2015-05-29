Polymer({
  is: 'oudjo-controller',
  _lastSongId: null,

  ready: function() {
    this.songTitle = 'oudjo';
    this.songArtist = '&zwnj';

    socket.emit('player', { action: 'get-status' });

    socket.on('player', function(details) {
      switch (details.action) {
        case 'get-status':
          this._updateStatus(details.status);
          break;

        case 'volume-changed':
          var newVolume = Math.floor(details.volume * 100);
          if (!this.$['slider-volume'].dragging) {
            this.$['slider-volume'].value = newVolume;
          }

          if (newVolume === 0) {
            this.$['button-mute'].icon = 'av:volume-off';
          } else if (newVolume === 100) {
            this.$['button-mute'].icon = 'av:volume-up';
          } else if (newVolume < 50) {
            this.$['button-mute'].icon = 'av:volume-mute';
          } else {
            this.$['button-mute'].icon = 'av:volume-down';
          }

          break;

        case 'time-update':
          var progress = Math.floor(details.progress * 100);
          this.$['song-progress'].value = progress;
          break;
      }
    }.bind(this));

    this.$['slider-volume'].addEventListener('immediate-value-change', function() {
      socket.emit('player', {
        action: 'volume-change',
        volume: (this.$['slider-volume'].immediateValue / 100)
      });
    }.bind(this));
  },

  _updateStatus: function(status) {

    // If the song has changed
    if (status.song._id !== this._lastSongId) {
      this.songTitle = status.song.title;
      this.songArtist = status.song.artist;

      this.$['album-art'].placeholder = this.$['album-art'].src;
      this.$['album-art'].src = '/library/' + status.song._id + '/art';

      this._lastSongId = status.song._id;
    }

    if (status.isPaused) {
      this.$['icon-play'].icon = 'av:play-arrow';
    } else {
      this.$['icon-play'].icon = 'av:pause';
    }

    var progress = Math.floor(status.playbackProgress * 100);
    this.$['song-progress'].value = progress;
  },

  _buttonPlayClick: function() {
    socket.emit('player', { action: 'play' });
  },

  _buttonPreviousClick: function() {
    socket.emit('player', { action: 'previous' });
  },

  _buttonNextClick: function() {
    socket.emit('player', { action: 'next' });
  },

  _buttonMuteClick: function() {
    socket.emit('player', { action: 'mute' });
  }
});
