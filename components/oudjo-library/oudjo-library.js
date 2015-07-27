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
    var currentHeight = 0;

    if (container.style.height === '' || container.style.height === '100%') {
      currentHeight = container.clientHeight;
    } else {
      // Remove 'px' suffix, and cast to int
      currentHeight = parseInt(container.style.height
        .substring(0, container.style.height.length - 2));
    }

    // 48px is height of paper-tabs, 5px is margin
    this.$.pages.style.height = (currentHeight - (48 + 5)) + 'px';
  }
});
