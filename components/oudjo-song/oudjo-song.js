Polymer({
  is: 'oudjo-song',

  properties: {
    songId: String,
    songTitle: String,
    songAlbum: String,
    songArtist: String,
    songYear: String,
    songLength: String
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
  }
});
