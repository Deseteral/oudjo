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

  load() {
    return new Promise((resolve, reject) => {
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
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  _loadLibraryDatastore() {
    return new Promise((resolve, reject) => {
      this.storage.library.loadDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          console.info('Loaded library datastore');
          resolve();
        }
      });
    });
  }

  _loadAlbumsDatastore() {
    return new Promise((resolve, reject) => {
      this.storage.albums.loadDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          console.info('Loaded albums datastore');
          resolve();
        }
      });
    });
  }

  _loadArtistsDatastore() {
    return new Promise((resolve, reject) => {
      this.storage.artists.loadDatabase((err) => {
        if (err) {
          reject(err);
        } else {
          console.info('Loaded artists datastore');
          resolve();
        }
      });
    });
  }
}
