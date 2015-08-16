Polymer({
  is: 'oudjo-library-songs',

  properties: {
    database: {
      type: Array
    }
  },

  _onShuffleAllClick: function() {
    socket.emit('library', { action: 'shuffle-all' });
  }
});
