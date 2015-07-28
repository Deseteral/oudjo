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

  // Get settings from main process
  var settings = ipc.sendSync('settings-get');

  // Configuring socket of newly connected user
  io.on('connection', function(socket) {
    console.log('User connected via socket');
    socketConfiguration(socket);
  });

  // Send an album art of specific song
  app.get('/library/:sid/art', function(req, res) {
    var sid = req.param('sid');

    var sendAlbumArt = function(picture) {
      return new Promise(function(fulfill) {
        res.set('Content-Type', 'image/' + picture.format);
        res.send(picture.data);
        fulfill();
      });
    };

    db.getAlbumArt(sid)
      .then(sendAlbumArt)
      .catch(console.error);
  });

  // Send JSON with all songs in library sorted alphabetically by title
  app.get('/library', function(req, res) {
    db.library.find({}).sort({ title: 1 }).exec(function(err, docs) {
      res.send(docs);
    });
  });

  // Serving static assets
  app.use('/bower_components', express.static('bower_components'));
  app.use('/components', express.static('components'));
  app.use('/resources', express.static('resources'));
  app.use('/', express.static('app'));

  // Starting web server
  http.listen(settings.port, function() {
    console.log('Listening on port ' + settings.port);
    ipc.send('core-server-ready');
  });

  // Opening database
  db = new Database();

  // If there's a database path in settings, use it to open the database
  if (settings.databasePath) {
    var audio = document.getElementsByTagName('audio')[0];
    player = new Player(audio, settings.databasePath);

    db.open(settings.databasePath);
  } else {
    // Open 'open directory' dialog
    changeDatabasePath();
  }

  // Registration of player controls for main process
  ipc.on('core-player-play', function() {
    if (player) {
      player.play();
    }
  });

  ipc.on('core-player-stop', function() {
    if (player) {
      player.stop();
    }
  });

  ipc.on('core-player-next', function() {
    if (player) {
      player.next();
    }
  });

  ipc.on('core-player-previous', function() {
    if (player) {
      player.previous();
    }
  });
}

function socketConfiguration(socket) {
  socket.on('player', function(details) {
    switch (details.action) {
      case 'play':
        player.play();
        break;

      case 'previous':
        player.previous();
        break;

      case 'next':
        player.next();
        break;

      case 'mute':
        player.mute();
        break;

      case 'stop':
        player.stop();
        break;

      case 'repeat':
        player.toggleRepeat();
        break;

      case 'volume-change':
        player.setVolume(details.volume);
        break;

      case 'get-status':
        sendPlayerStatus();
        break;
    }
  });

  socket.on('library', function(details) {
    switch (details.action) {
      case 'shuffle-all':
        shuffleAll();
        break;
    }
  });
}

function shuffleAll() {
  player.clearQueue();

  db.library.find({}, function(err, docs) {
    player.addToQueue(docs);
    player.shuffle();

    sendPlayerStatus();
  });
}

function sendPlayerStatus() {
  io.emit('player', {
    action: 'get-status',
    status: player.generateStatus()
  });
}

function changeDatabasePath() {
  // Stop currently played song, and clear the queue
  if (player !== null) {
    player.stop();
    player.clearQueue();
  }

  // Open the 'choose the folder' dialog
  var dialog = remote.require('dialog');
  var settings = ipc.sendSync('settings-get');

  var options = {
    title: 'Open database',
    properties: ['openDirectory']
  };

  dialog.showOpenDialog(remote.getCurrentWindow(), options, function(paths) {
    if (paths) {
      // Save new path to settings
      settings.databasePath = paths[0];
      ipc.sendSync('settings-change', settings);
      ipc.sendSync('settings-save');

      // Initialize the player and open the database
      var audio = document.getElementsByTagName('audio')[0];
      player = new Player(audio, settings.databasePath);

      db.open(settings.databasePath);
    }
  });
}

document.addEventListener('DOMContentLoaded', ready);
