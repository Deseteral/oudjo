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

    // Hide the oudjo-bar when user is on 'Now playing' tab
    if (app.page === 'now-playing') {
      $oudjoBar.hide();
    } else {
      $oudjoBar.show();
    }

    // Resize the view that user is about to see
    switch (app.page) {
      case 'now-playing':
        document.querySelector('oudjo-now-playing')._onResize();
        break;
      case 'settings':
        document.querySelector('oudjo-settings')._onResize();
        break;
    }
  });

  // Change page to 'Now playing' when user taps on oudjo-bar
  $oudjoBar.addEventListener('activate', function() {
    app.page = 'now-playing';
    document.querySelector('oudjo-now-playing')._onResize();
  });

  socket.on('library', function(details) {
    if (details.action === 'scanning-progress') {
      // Show toast
      document.querySelector('#toast-database-scanning').show();

      // Update progress bar on the toast
      document.querySelector('#progress-database-scanning').value =
        details.scanningProgress.progress;
    }
  });

  onResizeHandler.push(onWindowResize);
  onWindowResize();
});

// Adjusts the size of panel that's under toolbar and above oudjo-bar
// (#content-panel)
function onWindowResize() {
  // 64px because toolbar is 64px high
  var contentPanelHeight = window.innerHeight - 64;

  document.querySelector('#content-panel')
    .style.height = contentPanelHeight + 'px';
}
