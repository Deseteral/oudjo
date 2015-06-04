Polymer({
  is: 'oudjo-album-art',

  properties: {
    songId: {
      type: String,
      reflectToAttribute: true,
      observer: '_songIdChanged'
    }
  },

  _songIdChanged: function(newValue) {
    if (newValue !== undefined && newValue !== '' && newValue !== null) {
      this.$['album-art-image'].placeholder = this.$['album-art-image'].src;
      this.$['album-art-image'].src = '/library/' + newValue + '/art';
    } else {
      this.$['album-art-image'].placeholder = this.$['album-art-image'].src;
      this.$['album-art-image'].src = '../../resources/oudjo-album-art.png';
    }
  }
});
