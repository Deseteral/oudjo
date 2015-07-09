Polymer({
  is: 'oudjo-library',

  properties: {
    library: {
      type: Array
    }
  },

  ready: function() {
    this.tab = 'songs';

    fetch('/library')
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        this.library = json;
      }.bind(this));
  }
});
