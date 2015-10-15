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
    },
    highlight: {
      type: Boolean,
      value: false
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
