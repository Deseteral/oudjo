var fs = require('fs');
var Datastore = require('nedb');
var mm = require('musicmetadata');
var walk = require('walk');
var events = require('events');

var Song = require('./song');

function Database() {
  this.isOpen = false;
  this.path = null;

  this.library = null;
  this.albums = null;
  this.artists = null;

  this.scanningProgress = {
    isScanning: false,
    filesToScan: 0,
    currentFile: 0,
    progress: 0
  };

  this.events = new events.EventEmitter();
}

Database.prototype.open = function(path, callback) {
  this.isOpen = false;

  var dbDirectoryPath = path + '/.oudjo';

  // Create database directory if it doesn't exist
  try {
    fs.statSync(dbDirectoryPath);
  } catch (err) {
    fs.mkdirSync(dbDirectoryPath);
    fs.mkdirSync(dbDirectoryPath + '/cache');
  }

  this.path = path;
  this.library = new Datastore(path + '/.oudjo/library.db');
  this.albums = new Datastore(path + '/.oudjo/albums.db');
  this.artists = new Datastore(path + '/.oudjo/artists.db');

  var databasesToLoad = 3;
  var onDatabaseError = function(err, dbname) {
    if (err) {
      console.error(`Error reading ${dbname} database`);

      if (callback) {
        callback(err);
      }
    } else {
      console.log(`Loaded ${dbname} database`);

      databasesToLoad -= 1;

      if (databasesToLoad === 0) {
        this.isOpen = true;

        if (callback) {
          callback();
        }
      }
    }
  }.bind(this);

  this.library.loadDatabase(function(err) {
    onDatabaseError(err, 'library');
  });

  this.albums.loadDatabase(function(err) {
    onDatabaseError(err, 'albums');
  });

  this.artists.loadDatabase(function(err) {
    onDatabaseError(err, 'artists');
  });
};

Database.prototype.scan = function(callback) {
  if (!this.isOpen) {
    throw new Error('Couldn\'t scan database, because it isn\'t open');
  }

  this.scanningProgress.isScanning = true;

  // Count the amount of files in the directory
  var fileCount = 0;
  var walkOptions = {
    listeners: {
      names: function(root, nodeNamesArray) {
        fileCount += nodeNamesArray.length;
      }
    }
  };

  walk.walkSync(this.path, walkOptions);
  this.scanningProgress.filesToScan = fileCount;
  console.log(`Files to scan: ${fileCount}`);

  // Scan files
  walkOptions = {
    listeners: {
      file: this._scanOnFile.bind(this),
      end: function() {
        this.scanningProgress.progress = 100;
        this.events.emit('scanning-progress');
        this.events.emit('scanning-completed');
        console.log('Database scanning completed');

        if (callback) {
          callback();
        }
      }.bind(this)
    }
  };
  walk.walk(this.path, walkOptions);
};

Database.prototype._scanOnFile = function(root, fileStat, next) {
  var filePath = require('path').resolve(root, fileStat.name);
  var extension = require('path').extname(filePath).toLowerCase();

  var nextFile = function() {
    this.scanningProgress.currentFile += 1;
    this.scanningProgress.progress = parseInt(
      (this.scanningProgress.currentFile / this.scanningProgress.filesToScan) *
      100);

    this.events.emit('scanning-progress');

    next();
  }.bind(this);

  if (extension !== '.mp3') {
    nextFile();
    return;
  }

  mm(fs.createReadStream(filePath), { duration: true }, function(err, metadata) {
    if (err) {
      console.error(err);
    }

    var relativePath = filePath.slice(this.path.length, filePath.length);

    if (metadata.title === '' || metadata.artist.length === 0 || metadata.album === '') {
      nextFile();
      return;
    }

    var song = new Song(
      metadata.title,
      metadata.artist[0],
      metadata.album,
      metadata.year,
      metadata.track.no,
      parseInt(metadata.duration),
      relativePath
    );

    var addArtistId = function() {
      return new Promise(function(fulfill, reject) {
        this.artists.find({ name: song.artist }, function(err, docs) {
          if (err) {
            reject(err);
          }

          if (docs.length === 1) {
            song.artistId = docs[0]._id;
            fulfill();
          } else {
            this.artists.insert({ name: song.artist }, function(err, newDoc) {
              if (err) {
                reject(err);
              }

              song.artistId = newDoc._id;
              fulfill();
            });
          }
        }.bind(this));
      }.bind(this));
    }.bind(this);

    var addAlbumId = function() {
      return new Promise(function(fulfill, reject) {
        this.albums.find({ name: song.album }, function(err, docs) {
          if (err) {
            reject(err);
          }

          if (docs.length === 1) {
            song.albumId = docs[0]._id;
            fulfill();
          } else {
            this.albums.insert({ name: song.album }, function(err, newDoc) {
              if (err) {
                reject(err);
              }

              song.albumId = newDoc._id;
              fulfill();
            });
          }
        }.bind(this));
      }.bind(this));
    }.bind(this);

    var insertSong = function() {
      return new Promise(function(fulfill, reject) {
        this.library.insert(song, function(err) {
          if (err) {
            reject(err);
          }

          fulfill();
          nextFile();
        });
      }.bind(this));
    }.bind(this);

    addArtistId()
      .then(addAlbumId)
      .then(insertSong)
      .catch(console.error);

  }.bind(this));
};

Database.prototype.getAlbumArt = function(sid) {
  return new Promise(function(fulfill, reject) {
    this.library.find({ _id: sid }, function(err, docs) {
      if (err) {
        reject(err);
      }

      if (docs.length === 0) {
        reject(new Error('No song with such ID'));
      }

      var song = docs[0];
      mm(fs.createReadStream(this.path + song.path), function(err, metadata) {
        if (err) {
          reject(err);
        }

        if (metadata.picture.length === 0) {
          reject(new Error('Requested song has no album art'));
        } else {
          fulfill(metadata.picture[0]);
        }
      });
    }.bind(this));
  }.bind(this));
};

module.exports = Database;
