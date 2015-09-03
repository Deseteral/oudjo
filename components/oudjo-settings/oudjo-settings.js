Polymer({
  is: 'oudjo-settings',

  ready: function() {
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

    // oudjo-bar is 64px high
    this.$.card.style.height = (currentHeight - 64) + 'px';
  }
});
