Polymer({
  is: 'oudjo-library',

  behaviors: [
    Polymer.IronResizableBehavior
  ],

  listeners: {
    'iron-resize': '_onResize'
  },

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
  },

  // TODO: Call this function after the list is loaded
  _onResize: function() {
    var container = this.$.container;

    if (container.style.height === '') {
      this.$.pages.style.height = (container.clientHeight - (48 + 8)) + 'px';
    } else {
      var currentHeight =
        parseInt(container.style.height.substring(0, container.style.height.length - 2));

      this.$.pages.style.height = (currentHeight - 48 - 5) + 'px';
    }
  }
});
