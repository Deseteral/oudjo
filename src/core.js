const express = require('express');
const ipcRenderer = require('electron').ipcRenderer;

var httpServer = express();

// Print pretty info into the console
console.log('%coudjo -- core', 'font-size: x-large; background: ' +
  '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%);' +
  '-webkit-background-clip: text;' +
  '-webkit-text-fill-color: transparent;');

// Serving static assets
httpServer.use('/', express.static(`${__dirname}/app`));
httpServer.use('/bower_components', express.static(`${__dirname}/../bower_components`));
httpServer.use('/resources', express.static(`${__dirname}/../resources`));

httpServer.listen(3000, () => {
  console.log('oudjo server listening on port 3000');
  ipcRenderer.send('core-server-ready');
});
