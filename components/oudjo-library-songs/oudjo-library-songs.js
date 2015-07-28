Polymer({
  is: 'oudjo-library-songs',

  properties: {
    database: {
      type: Array
    }
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
  },

  _onShuffleAllClick: function() {
    socket.emit('library', { action: 'shuffle-all' });
  }
});
