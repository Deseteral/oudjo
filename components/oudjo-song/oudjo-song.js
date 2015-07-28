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
    this._onResize();
  },

  _onResize: function() {
    var windowWidth = window.innerWidth;

    if (windowWidth <= 400) {
      this.$['info-year'].style.display = 'none';
    } else {
      this.$['info-year'].style.display = '';
    }
  }
});
