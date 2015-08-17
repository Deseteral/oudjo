Polymer({
  is: 'oudjo-album-art',

  properties: {
    songId: {
      type: String,
      reflectToAttribute: true,
      observer: '_songIdChanged'
    },
    tweenArts: {
      type: Boolean,
      value: false
    }
  },

  _songIdChanged: function(newValue) {
    var $img = this.$['album-art-image'];

    if (this.tweenArts) {
      // Set current art as placeholder
      $img.placeholder = $img.src;

      // If new songId is not specified, use default oudjo album art
      if (newValue !== undefined && newValue !== '' && newValue !== null) {
        $img.src = '/library/' + newValue + '/art';
      } else {
        $img.src = '../../resources/oudjo-album-art.png';
      }
    } else {
      $img.src = '/library/' + newValue + '/art';
    }
  }
});
