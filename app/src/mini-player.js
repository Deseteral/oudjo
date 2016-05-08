const electron = require('electron');
const ipc = electron.ipcRenderer;

// Hide the window instead of closing it
window.onbeforeunload = (e) => {
  ipc.send('mini-player-hide');
  e.returnValue = false;
};
