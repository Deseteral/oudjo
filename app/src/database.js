var fs = require('fs');
var Datastore = require('nedb');
var recursiveReaddir = require('recursive-readdir');
var path = require('path');

function Database() {
  this.isOpen = false;
  this.path = null;
  this.db = {};
}

Database.prototype.open = function(path) {

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
  this.db.library = new Datastore(path + '/.oudjo/library.db');
  this.db.albums = new Datastore(path + '/.oudjo/albums.db');
  this.db.artists = new Datastore(path + '/.oudjo/artists.db');

  var databasesToLoad = 3;
  var onDatabaseError = function(err, dbname) {
    if (err) {
      console.error(`Error reading ${dbname} database`);
    } else {
      console.log(`Loaded ${dbname} database`);

      databasesToLoad -= 1;

      if (databasesToLoad === 0) {
        this.isOpen = true;
      }
    }
  }.bind(this);

  this.db.library.loadDatabase(function(err) {
    onDatabaseError(err, 'library');
  });

  this.db.albums.loadDatabase(function(err) {
    onDatabaseError(err, 'albums');
  });

  this.db.artists.loadDatabase(function(err) {
    onDatabaseError(err, 'artists');
  });
};

Database.prototype.scan = function() {
  if (!this.isOpen) {
    throw new Error('Couldn\'t scan database, because it isn\'t open');
  }

  recursiveReaddir(this.path, function(err, files) {

    files.forEach(function(filePath) {
      var extension = path.extname(filePath).toLowerCase();

      if (extension !== '.mp3') {
        return;
      }
    });
  });
};

module.exports = Database;
