var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ipc = require('ipc');
var remote = require('remote');
var Database = require('./src/database');
var Player = require('./src/player');

var player = null;
var db = null;

function ready() {
  // Print pretty info into the console
  console.log('%coudjo -- core', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  var audio = document.getElementsByTagName('audio')[0];
  player = new Player(audio);

  var settings = ipc.sendSync('settings-get');

  io.on('connection', function(socket) {
    console.log('User connected via socket');
    socketConfiguration(socket);
  });

  app.use('/bower_components', express.static('bower_components'));
  app.use('/components', express.static('components'));
  app.use('/resources', express.static('resources'));
  app.use('/', express.static('app'));

  http.listen(settings.port, function() {
    console.log('Listening on port ' + settings.port);
    ipc.send('core-server-ready');
  });

  db = new Database();

  if (settings.databasePath) {
    db.open(settings.databasePath, function() {
      db.library.find({}, function(err, docs) {
        player.addToQueue(docs);
      });
    });
  } else {
    // Open 'open directory' dialog
    changeDatabasePath();
  }
}

function socketConfiguration(socket) {
  socket.on('player', function(action) {
    switch (action) {
      case 'play':
        player.play();
        break;

      case 'previous':
        player.previous();
        break;

      case 'next':
        player.next();
        break;
    }
  });
}

function changeDatabasePath() {
  var dialog = remote.require('dialog');
  var settings = ipc.sendSync('settings-get');

  var options = {
    title: 'Open database',
    properties: ['openDirectory']
  };

  dialog.showOpenDialog(remote.getCurrentWindow(), options, function(paths) {
    if (paths) {
      settings.databasePath = paths[0];
      ipc.sendSync('settings-change', settings);
      ipc.sendSync('settings-save');

      db.open(settings.databasePath);
    }
  });
}

document.addEventListener('DOMContentLoaded', ready);
