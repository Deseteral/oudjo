Polymer({
  is: 'oudjo-controller',

  buttonPlayClick: function() {
    socket.emit('player', 'play');
  },

  buttonPreviousClick: function() {
    socket.emit('player', 'previous');
  },

  buttonNextClick: function() {
    socket.emit('player', 'next');
  }
});
