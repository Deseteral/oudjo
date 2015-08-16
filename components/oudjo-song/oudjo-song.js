Polymer({
  is: 'oudjo-song',

  properties: {
    songId: String,
    songTitle: String,
    songAlbum: String,
    songArtist: String,
    songYear: {
      type: String,
      observer: '_yearChanged'
    },
    songLength: {
      type: String,
      observer: '_lengthChanged'
    }
  },

  ready: function() {
    window.onResizeHandler.push(this._onResize.bind(this));

    // Give some time for the element to load the data
    window.setTimeout(function() {
      this._onResize();
    }.bind(this), 100);
  },

  _onResize: function() {
    var width = this.$.container.clientWidth;

    if (width <= 700) {
      this.$['info-length'].style.display = 'none';
    } else {
      this.$['info-length'].style.display = '';
    }

    if (width <= 550) {
      this.$['year-container'].style.display = 'none';
    } else {
      this.$['year-container'].style.display = '';
    }

    if (width <= 500) {
      this.$['info-album'].style.display = 'none';
    } else {
      this.$['info-album'].style.display = '';
    }
  },

  _yearChanged: function(newValue) {
    // Only set first four digits
    // e.g. from '2007-07-10T07:00:00Z' only set '2007'
    this._songYearCalculated = newValue.substring(0, 4);
  },

  _lengthChanged: function(newValue) {
    this._songLengthCalculated = this._calculateLength(newValue);
  },

  _calculateLength: function(fileSeconds) {
    var minutes = parseInt(fileSeconds / 60);
    var seconds = fileSeconds - (minutes * 60);

    // If seconds are one digit, add '0' prefix
    // so that '4' seconds becomes '04'
    if (seconds.toString().length === 1) {
      seconds = '0' + seconds.toString();
    }

    return minutes + ':' + seconds;
  }
});
