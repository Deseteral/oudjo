Polymer({
  is: 'oudjo-now-playing',

  ready: function() {
    this.tab = 'now-playing';
    window.onResizeHandler.push(this._onResize.bind(this));
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

    // 48px is height of paper-tabs and 5px is margin
    this.$.pages.style.height = (currentHeight - (48 + 5)) + 'px';
  }
});
