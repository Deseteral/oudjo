var express = require('express')();
var server = require('http').Server(express);
var io = require('socket.io')(server);
var ipc = require('ipc');

var audio;

document.addEventListener('DOMContentLoaded', function() {
  // Print pretty info into the console
  console.log('%coudjo -- core', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%); -webkit-background-clip: ' +
    'text; -webkit-text-fill-color: transparent;');

  audio = document.getElementsByTagName('audio')[0];

  io.on('connection', function() {
    console.log('User connected');
  });

  var port = ipc.sendSync('settings-get').port;
  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
