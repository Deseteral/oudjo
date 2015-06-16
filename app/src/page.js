var socket = io();

window.addEventListener('WebComponentsReady', function() {
  // Print pretty info into the console
  console.log('%coudjo -- main-window', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #bcff05 0%,#70cd19 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  var app = document.querySelector('#app');
  app.page = 'library';

  var drawerMenu = document.querySelector('#drawer-menu');
  var drawerPanel = document.querySelector('paper-drawer-panel');

  // Close the drawer, when item is selected
  drawerMenu.addEventListener('iron-activate', function() {
    drawerPanel.closeDrawer();
  });
});
