var socket = io();
var onResizeHandler = [];

window.addEventListener('DOMContentLoaded', function() {
  var app = document.querySelector('#app');
  app.page = 'library';
});

window.addEventListener('WebComponentsReady', function() {
  // Print pretty info into the console
  console.log('%coudjo -- main-window', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #bcff05 0%,#70cd19 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');

  // When window is resized, call all functions stored in handler array
  window.onresize = function() {
    onResizeHandler.forEach(function(f) {
      f();
    });
  };

  var app = document.querySelector('#app');

  var $oudjoBar = document.querySelector('oudjo-bar');
  var $drawerMenu = document.querySelector('#drawer-menu');
  var $drawerPanel = document.querySelector('paper-drawer-panel');

  // Close the drawer, when item is selected
  $drawerMenu.addEventListener('iron-select', function() {
    $drawerPanel.closeDrawer();

    if (app.page === 'now-playing') {
      $oudjoBar.hide();

      document.querySelector('oudjo-now-playing')._onResize();
    } else {
      $oudjoBar.show();
    }
  });

  // Change page to 'Now playing' when user taps on oudjo-bar
  $oudjoBar.addEventListener('activate', function() {
    app.page = 'now-playing';
    document.querySelector('oudjo-now-playing')._onResize();
  });

  onResizeHandler.push(onWindowResize);
  onWindowResize();
});

// Adjusts the size of panel that's under toolbar and above oudjo-bar
function onWindowResize() {
  // 64px because toolbar is 64px high
  var contentPanelHeight = window.innerHeight - 64;

  // When oudjo-bar is hidden, make content panel 64px higher
  if (document.querySelector('oudjo-bar').style.display === 'none') {
    contentPanelHeight += 64;
  }

  document.querySelector('#content-panel')
    .style.height = contentPanelHeight + 'px';
}
