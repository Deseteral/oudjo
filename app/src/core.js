var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ipc = require('ipc');
var remote = require('remote');

var bodyParser = require('body-parser');

var Database = require('./src/database');
var Player = require('./src/player');

var player = null;
var db = null;

function ready() {
  // Print pretty info into the console
  console.log('%coudjo -- core', 'font-size: x-large; background: ' +
    '-webkit-linear-gradient(top, #ffbbed 0%,#ff4da0 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');

  // Configuring socket of newly connected user
  io.on('connection', function(socket) {
    console.log('User connected via socket');
    socketConfiguration(socket);
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Setup REST API endpoints
  restConfiguration(app);

  // Serving static assets
  app.use('/bower_components', express.static('bower_components'));
  app.use('/components', express.static('components'));
  app.use('/resources', express.static('resources'));
  app.use('/', express.static('app'));

  // Starting web server
  var settingsPort = ipc.sendSync('settings-get-value', 'port');
  http.listen(settingsPort, function() {
    console.log('Listening on port ' + settingsPort);
    ipc.send('core-server-ready');
  });

  // Opening database
  db = new Database();
  db.events.on('scanning-progress', function() {
    sendDatabaseScanningProgress();
  });

  // If there's a database path in settings, use it to open the database
  var settingsDbPath = ipc.sendSync('settings-get-value', 'databasePath');
  if (settingsDbPath && settingsDbPath !== '') {
    var audio = document.getElementsByTagName('audio')[0];
    player = new Player(audio, settingsDbPath);

    db.open(settingsDbPath);
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

function restConfiguration(app) {

  // Send JSON with all songs in library sorted alphabetically by title
  app.get('/library', function(req, res) {
    db.library.find({}).sort({ title: 1 }).exec(function(err, docs) {
      res.send(docs);
    });
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

  app.get('/library/shuffle-all', function(req, res) {
    shuffleAll();
    res.status(200).end();
  });

  app.get('/player/play', function(req, res) {
    player.play();
    res.status(200).end();
  });

  app.get('/player/previous', function(req, res) {
    player.previous();
    res.status(200).end();
  });

  app.get('/player/next', function(req, res) {
    player.next();
    res.status(200).end();
  });

  app.get('/player/mute', function(req, res) {
    player.mute();
    res.status(200).end();
  });

  app.get('/player/stop', function(req, res) {
    player.stop();
    res.status(200).end();
  });

  app.get('/player/repeat', function(req, res) {
    player.toggleRepeat();
    res.status(200).end();
  });

  // Change player volume
  app.post('/player/volume', function(req, res) {
    var volume = parseInt(req.body.volume);

    if (volume >= 0 && volume <= 100) {
      player.setVolume(volume / 100);
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  });

  // Send JSON with player status
  app.get('/player/status', function(req, res) {
    res.send(player.generateStatus());
  });

  // Send JSON with all songs in queue
  app.get('/player/queue', function(req, res) {
    res.send(player.queue);
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
  player.clearQueue(false);

  db.library.find({}, function(err, docs) {
    player.addToQueue(docs, false);
    player.shuffle(false);

    sendPlayerStatus();
    sendQueue();
  });
}

function sendPlayerStatus() {
  io.emit('player', {
    action: 'get-status',
    status: player.generateStatus()
  });
}

function sendQueue() {
  io.emit('player', {
    action: 'get-queue',
    queue: player.queue
  });
}

function sendDatabaseScanningProgress() {
  io.emit('library', {
    action: 'scanning-progress',
    scanningProgress: db.scanningProgress
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

  var options = {
    title: 'Open database',
    properties: ['openDirectory']
  };

  dialog.showOpenDialog(remote.getCurrentWindow(), options, function(paths) {
    if (paths) {
      // Save new path to settings
      ipc.sendSync('settings-change', {
        name: 'databasePath',
        value: paths[0]
      });
      ipc.sendSync('settings-save');

      // Initialize the player and open the database
      var audio = document.getElementsByTagName('audio')[0];
      player = new Player(audio, paths[0]);

      db.open(paths[0]);
    }
  });
}

document.addEventListener('DOMContentLoaded', ready);
