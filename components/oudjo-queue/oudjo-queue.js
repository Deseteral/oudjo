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
      }
    }.bind(this));

    this.pullData();
  },

  pullData: function() {
    socket.emit('player', { action: 'get-queue' });
  }
});
