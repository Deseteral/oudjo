var express = require('express')();
var server = require('http').Server(express);
var io = require('socket.io')(server);
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
  server.listen(settings.port, function() {
    console.log('Listening on port ' + settings.port);
  });

  io.on('connection', function() {
    console.log('User connected');
  });

  db = new Database();

  if (settings.databasePath) {
    db.open(settings.databasePath);
  } else {
    // Open 'open directory' dialog
    changeDatabasePath();
  }
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
