var express = require('express')();
var server = require('http').Server(express);
var io = require('socket.io')(server);
var ipc = require('ipc');
var remote = require('remote');

var audio;

function ready() {
  // Print pretty info into the console
  console.log('%coudjo -- core', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  audio = document.getElementsByTagName('audio')[0];

  var settings = ipc.sendSync('settings-get');
  var port = settings.port;

  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });

  io.on('connection', function() {
    console.log('User connected');
  });

  if (settings.databasePath) {
    openDatabase();
  } else {
    // Open 'open directory' dialog
    var dialog = remote.require('dialog');
    var options = {
      title: 'Open database',
      properties: ['openDirectory']
    };

    dialog.showOpenDialog(remote.getCurrentWindow(), options, function(path) {
      settings.databasePath = path[0];
      ipc.sendSync('settings-change', settings);
      ipc.sendSync('settings-save');
    });

    openDatabase();
  }
}

function openDatabase() {
}

document.addEventListener('DOMContentLoaded', ready);
