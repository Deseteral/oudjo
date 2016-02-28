const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

export class Database {
  constructor(rootPath) {
    this.paths = {
      root: rootPath,
      databaseDir: path.join(rootPath, '.oudjo'),
      libraryDbFile: path.join(rootPath, '.oudjo', 'library.db'),
      albumsDbFile: path.join(rootPath, '.oudjo', 'albums.db'),
      artistsDbFile: path.join(rootPath, '.oudjo', 'artists.db')
    };

    this.storage = {
      library: null,
      albums: null,
      artists: null
    };
  }

  load(callback) {
    // Create database directory if it doesn't exist
    try {
      fs.statSync(this.paths.databaseDir);
    } catch (err) {
      fs.mkdirSync(this.paths.databaseDir);
      console.info('Created database directory (.oudjo)');
    }

    this.storage.library = new Datastore(this.paths.libraryDbFile);
    this.storage.albums = new Datastore(this.paths.albumsDbFile);
    this.storage.artists = new Datastore(this.paths.artistsDbFile);

    this._loadLibraryDatastore()
      .then(this._loadAlbumsDatastore.bind(this))
      .then(this._loadArtistsDatastore.bind(this))
      .then(() => {
        console.info('Database loaded');
        callback();
      })
      .catch((err) => console.error(err));
  }

  _loadLibraryDatastore() {
    return new Promise((fulfill, reject) => {
      this.storage.library.loadDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          console.info('Loaded library datastore');
          fulfill();
        }
      });
    });
  }

  _loadAlbumsDatastore() {
    return new Promise((fulfill, reject) => {
      this.storage.albums.loadDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          console.info('Loaded albums datastore');
          fulfill();
        }
      });
    });
  }

  _loadArtistsDatastore() {
    return new Promise((fulfill, reject) => {
      this.storage.artists.loadDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          console.info('Loaded artists datastore');
          fulfill();
        }
      });
    });
  }
}
