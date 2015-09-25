var socket = io();

var orientationHorizontal = true;

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

  // Handle window resizing
  window.onresize = onWindowResize;

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
  });

  // Change page to 'Now playing' when user taps on oudjo-bar
  $oudjoBar.addEventListener('activate', function() {
    app.page = 'now-playing';
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

  onWindowResize();
});

function onWindowResize() {

  // Adjusts the size of panel that's under toolbar and above oudjo-bar
  // (#content-panel)

  // 64px because toolbar is 64px high
  var contentPanelHeight = window.innerHeight - 64;

  document.querySelector('#content-panel')
    .style.height = contentPanelHeight + 'px';

  // Calculate screen orientation
  var lastOrientation = orientationHorizontal;

  if (window.innerHeight < window.innerWidth) {
    orientationHorizontal = true;
  } else {
    orientationHorizontal = false;
  }

  if (lastOrientation !== orientationHorizontal) {
    document.querySelector('oudjo-library')._onResize();
    document.querySelector('oudjo-now-playing')._onResize();
    document.querySelector('oudjo-settings')._onResize();
  }
}
