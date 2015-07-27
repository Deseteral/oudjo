var socket = io();

window.addEventListener('WebComponentsReady', function() {
  // Print pretty info into the console
  console.log('%coudjo -- main-window', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #bcff05 0%,#70cd19 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  window.onresize = onWindowResize;
  var app = document.querySelector('#app');

  onWindowResize();
});

function onWindowResize() {
  var contentPanelHeight = window.innerHeight - 128;
  document.querySelector('#content-panel').style.height = contentPanelHeight + 'px';
}
