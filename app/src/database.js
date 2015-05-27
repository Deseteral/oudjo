var fs = require('fs');
var Datastore = require('nedb');
var path = require('path');
var mm = require('musicmetadata');
var walk = require('walk');
var Song = require('./song');

function Database() {
  this.isOpen = false;
  this.path = null;

  this.library = null;
  this.albums = null;
  this.artists = null;
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
      callback(err);
    } else {
      console.log(`Loaded ${dbname} database`);

      databasesToLoad -= 1;

      if (databasesToLoad === 0) {
        this.isOpen = true;
        callback();
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

Database.prototype.scan = function() {
  if (!this.isOpen) {
    throw new Error('Couldn\'t scan database, because it isn\'t open');
  }

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
  console.log(`Files to scan: ${fileCount}`);

  // Scan files
  walkOptions = {
    listeners: {
      file: this._scanOnFile.bind(this)
    }
  };
  walk.walk(this.path, walkOptions);
};

Database.prototype._scanOnFile = function(root, fileStat, next) {
  var filePath = path.resolve(root, fileStat.name);
  var extension = path.extname(filePath).toLowerCase();

  if (extension !== '.mp3') {
    next();
    return;
  }

  mm(fs.createReadStream(filePath), function(err, metadata) {
    if (err) {
      console.error(err);
    }

    var song = new Song(
      metadata.title,
      metadata.artist[0],
      metadata.album,
      metadata.year,
      filePath
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
          next();
        });
      }.bind(this));
    }.bind(this);

    addArtistId()
      .then(addAlbumId)
      .then(insertSong)
      .catch(console.error);

  }.bind(this));
};

module.exports = Database;
