Polymer({
  is: 'oudjo-library',

  behaviors: [
    Polymer.IronResizableBehavior
  ],

  listeners: {
    'iron-resize': '_onResize'
  },

  properties: {
    database: {
      type: Array
    }
  },

  ready: function() {
    this.tab = 'songs';
  },

  _dataReceived: function(e) {
    this.database = e.detail.response;
    this.$['library-songs'].database = this.database;

    // Give some time for iron-list to load all of the elements
    window.setTimeout(function() {
      this._onResize();
    }.bind(this), 100);
  },

  _onResize: function() {
    var container = this.$.container;

    if (container.style.height === '') {
      this.$.pages.style.height = (container.clientHeight - 48) + 'px';
    } else {
      var currentHeight =
        parseInt(container.style.height.substring(0, container.style.height.length - 2));

      this.$.pages.style.height = (currentHeight - 48 - 5) + 'px';
    }
  }
});
