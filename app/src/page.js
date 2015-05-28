var socket = null;

window.addEventListener('WebComponentsReady', function() {
  // Print pretty info into the console
  console.log('%coudjo -- main-window', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #bcff05 0%,#70cd19 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  socket = io();
});
