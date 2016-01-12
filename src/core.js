const express = require('express');

var httpServer = express();

// Serving static assets
httpServer.use('/', express.static('build/app'));
httpServer.use('/bower_components', express.static('bower_components'));
httpServer.use('/resources', express.static('resources'));

httpServer.listen(3000, () => {
  // Print pretty info into the console
  console.log('%coudjo -- core', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');

  console.log('Example app listening on port 3000!');
});
