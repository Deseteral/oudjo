Polymer({
  is: 'oudjo-queue',

  properties: {
    queue: {
      type: Array
    }
  },

  ready: function() {
    socket.on('player', function(details) {
      if (details.action === 'get-queue') {
        this.queue = details.queue;
        this.$.list.scrollToIndex(0);
      }
    }.bind(this));
  }
});
