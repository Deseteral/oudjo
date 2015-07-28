Polymer({
  is: 'oudjo-controller',
  _lastSongId: null,

  ready: function() {
    this.songTitle = 'oudjo';

    window.onResizeHandler.push(this._onResize.bind(this));

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

    this.$['slider-volume'].addEventListener('change', function() {
      socket.emit('player', {
        action: 'volume-change',
        volume: (this.$['slider-volume'].value / 100)
      });
    }.bind(this));

    this._onResize();
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

    if (status.isPaused) {
      this.$['icon-play'].icon = 'av:play-arrow';
    } else {
      this.$['icon-play'].icon = 'av:pause';
    }

    var progress = Math.floor(status.playbackProgress * 100);
    this.$['song-progress'].value = progress;

    if (status.repeat) {
      this.$['button-repeat'].style.color = '#EEFF41'; // Lime 500
    } else {
      this.$['button-repeat'].style.color = '#F9FBE7'; // Lime 50
    }
  },

  _onResize: function() {
    var windowWidth = window.innerWidth;

    var classes = this.$.card.className.split(' ');
    var newClasses = [];

    // Remove 'horizontal' and 'vertical' from class list
    classes.forEach(function(e) {
      if (e !== 'horizontal' && e !== 'vertical') {
        newClasses.push(e);
      }
    });

    if (windowWidth >= 556) {
      newClasses.push('horizontal');

      this.$['album-art'].style.width = '256px';
      this.$['album-art'].style.height = '256px';
    } else {
      newClasses.push('vertical');

      this.$['album-art'].style.width = (windowWidth + 'px');
      this.$['album-art'].style.height = (windowWidth + 'px');
    }

    this.$.card.className = newClasses.join(' ');
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
  },

  _buttonStopClick: function() {
    socket.emit('player', { action: 'stop' });
  },

  _buttonRepeatClick: function() {
    socket.emit('player', { action: 'repeat' });
  }
});
