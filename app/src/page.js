var socket = io();

window.addEventListener('DOMContentLoaded', function() {
  var app = document.querySelector('#app');
  app.page = 'library';
});

window.addEventListener('WebComponentsReady', function() {
  // Print pretty info into the console
  console.log('%coudjo -- main-window', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #bcff05 0%,#70cd19 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  window.onresize = onWindowResize;
  var app = document.querySelector('#app');

  var $oudjoBar = document.querySelector('oudjo-bar');
  var $drawerMenu = document.querySelector('#drawer-menu');
  var $drawerPanel = document.querySelector('paper-drawer-panel');

  // Close the drawer, when item is selected
  $drawerMenu.addEventListener('iron-select', function() {
    $drawerPanel.closeDrawer();

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

  onWindowResize();
});

// Adjusts the size of panel that's under toolbar and above oudjo-bar
function onWindowResize() {
  // 128px because toolbar and oudjo-bar are both 64px high
  var contentPanelHeight = window.innerHeight - 128;
  document.querySelector('#content-panel').style.height = contentPanelHeight + 'px';

  // Adjust size of oudjo-library
  document.querySelector('oudjo-library')._onResize();
}
