Polymer({
  is: 'oudjo-song',

  behaviors: [
    Polymer.IronResizableBehavior
  ],

  listeners: {
    'iron-resize': '_onResize'
  },

  properties: {
    songId: String,
    songTitle: String,
    songAlbum: String,
    songArtist: String,
    songYear: String,
    songLength: String
  },

  ready: function() {
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
