Polymer({
  is: 'oudjo-library-songs',

  properties: {
    database: {
      type: Array
    }
  },

  ready: function() {
    this.database = [];
  }
});
