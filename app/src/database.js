const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');
const walk = require('walk');
const mm = require('musicmetadata');

import { Song } from './song';

export class Database {
  constructor(rootPath) {
    this.loaded = false;

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

    this.scanningStatus = {
      isScanning: false,
      currentFile: 0,
      filesToScan: 0
    };
  }

  load() {
    return new Promise((resolve, reject) => {
      this.loaded = false;

      // Create database directory if it doesn't exist.
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
          this.loaded = true;
          console.info('Database loaded');
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  scan() {
    if (!this.loaded) {
      throw new Error('Cannot scan database, because it isn\'t loaded!');
    }

    this.scanningStatus.isScanning = true;

    console.info('Staring library scan');

    // Count the amount of files in the directory
    let fileCount = 0;
    let walkOptions = {
      listeners: {
        file: () => {
          fileCount++;
        }
      }
    };

    walk.walkSync(this.paths.root, walkOptions);
    this.scanningStatus.filesToScan = fileCount;
    console.log(`Files to scan: ${fileCount}`);

    // Scanning
    walkOptions = {
      listeners: {
        file: this._scanOnFile.bind(this),
        end: () => {
          this.scanningStatus.isScanning = false;
          console.info('Library scanning completed');
        }
      }
    };

    walk.walk(this.paths.root, walkOptions);
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

  _scanOnFile(root, fileStat, next) {
    let filePath = path.resolve(root, fileStat.name);
    let extension = path.extname(filePath).toLowerCase();

    let nextFile = () => {
      this.scanningStatus.currentFile++;
      next();
    };

    // TODO: Enable different file extensions.
    if (extension !== '.mp3') {
      nextFile();
      return;
    }

    mm(fs.createReadStream(filePath), { duration: true }, (err, metadata) => {
      if (err) {
        console.error(err);
        nextFile();
        return;
      }

      let relativePath = filePath.slice(
        this.paths.root.length,
        filePath.length
      );

      // TODO: Instead of skipping the song, show appropriate message to the
      //       user, after the scan is completed.
      // TODO: This is propably buggy, database scanning has to be tested using
      //       not tagged songs.
      if (metadata.title === '' ||
          metadata.artist === undefined ||
          metadata.artist.length === 0 ||
          metadata.album === '') {

        console.warn(`Rejected ${relativePath}, because of missing metadata`);
        console.log(metadata);
        nextFile();
        return;
      }

      let genre = metadata.genre === undefined ? undefined : metadata.genre[0];
      let length = parseInt(metadata.duration);

      let song = new Song(
        metadata.title,
        metadata.artist[0],
        metadata.album,
        metadata.year,
        metadata.track,
        genre,
        length,
        relativePath
      );

      let addArtistId = () => {
        return new Promise((fulfill, reject) => {
          this.storage.artists.find({ name: song.artist }, (err, docs) => {
            if (err) {
              reject(err);
            }

            if (docs.length === 1) {
              song.artistId = docs[0]._id;
              fulfill();
            } else {
              this.storage.artists.insert({ name: song.artist }, (er, doc) => {
                if (er) {
                  reject(er);
                }

                song.artistId = doc._id;
                fulfill();
              });
            }
          });
        });
      };

      let addAlbumId = () => {
        return new Promise((fulfill, reject) => {
          this.storage.albums.find({ name: song.album }, (err, docs) => {
            if (err) {
              reject(err);
            }

            if (docs.length === 1) {
              song.albumId = docs[0]._id;
              fulfill();
            } else {
              this.storage.albums.insert({ name: song.album }, (er, doc) => {
                if (er) {
                  reject(er);
                }

                song.albumId = doc._id;
                fulfill();
              });
            }
          });
        });
      };

      let insertSong = () => {
        return new Promise((fulfill, reject) => {
          this.storage.library.insert(song, (err) => {
            if (err) {
              reject(err);
            }

            fulfill();
          });
        });
      };

      // TODO: Add error logging that is visible to the user.
      addArtistId()
        .then(addAlbumId)
        .then(insertSong)
        .then(() => nextFile())
        .catch((err) => {
          console.error(err);
          nextFile();
        });
    });
  }
}
