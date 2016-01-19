const fs = require('fs');
const Datastore = require('nedb');
const mm = require('musicmetadata');
const walk = require('walk');
const events = require('events');
const path = require('path');

const Song = require('./song');

class Database {
  constructor() {
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

  open(dbPath, callback) {
    this.isOpen = false;

    let dbDirectoryPath = path.join(dbPath, '.oudjo');

    // Create database directory if it doesn't exist
    try {
      fs.statSync(dbDirectoryPath);
    } catch (err) {
      fs.mkdirSync(dbDirectoryPath);
      fs.mkdirSync(path.join(dbDirectoryPath, 'cache'));
    }

    this.path = dbPath;
    this.library = new Datastore(path.join(dbDirectoryPath, 'library.db'));
    this.albums = new Datastore(path.join(dbDirectoryPath, 'albums.db'));
    this.artists = new Datastore(path.join(dbDirectoryPath, 'artists.db'));

    let databasesToLoad = 3;
    let onDatabaseError = (err, dbname) => {
      if (!err) {
        console.log(`Loaded ${dbname} database`);

        databasesToLoad--;

        if (databasesToLoad === 0) {
          this.isOpen = true;
          callback();
        }
      } else {
        console.error(`Error reading ${dbname} database`);
        callback(err);
      }
    };

    this.library.loadDatabase((err) => {
      onDatabaseError(err, 'library');
    });

    this.albums.loadDatabase((err) => {
      onDatabaseError(err, 'albums');
    });

    this.artists.loadDatabase((err) => {
      onDatabaseError(err, 'artists');
    });
  }

  scan(callback) {
    if (!this.isOpen) {
      throw new Error('Couldn\'t scan database, because it isn\'t open');
    }

    this.scanningProgress.isScanning = true;

    // Count the amount of files in the directory
    let fileCount = 0;
    let walkOptions = {
      listeners: {
        names: (root, nodeNamesArray) => {
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
        file: this._scanOnFile,
        end: () => {
          this.scanningProgress.progress = 100;
          this.events.emit('scanning-progress');
          this.events.emit('scanning-completed');
          console.log('Database scanning completed');

          if (callback) {
            callback();
          }
        }
      }
    };
    walk.walk(this.path, walkOptions);
  }

  getAlbumArt(sid) {
    return new Promise((fulfill, reject) => {
      this.library.find({ _id: sid }, (err, docs) => {
        if (err) {
          reject(err);
        }

        if (docs.length === 0) {
          reject(new Error('No song with such ID'));
        }

        let song = docs[0];
        mm(fs.createReadStream(this.path + song.path), (err, metadata) => {
          if (err) {
            reject(err);
          }

          if (metadata.picture.length === 0) {
            reject(new Error('Requested song has no album art'));
          } else {
            fulfill(metadata.picture[0]);
          }
        });
      });
    });
  }

  _scanOnFile(root, fileStat, next) {
    let filePath = path.resolve(root, fileStat.name);
    let extension = path.extname(filePath).toLowerCase();

    let nextFile = () => {
      let sp = this.scanningProgress;

      sp.currentFile++;
      sp.progress = parseInt((sp.currentFile / sp.filesToScan) * 100);

      this.events.emit('scanning-progress');

      next();
    };

    // TODO: Enable different file extensions
    if (extension !== '.mp3') {
      nextFile();
      return;
    }

    mm(fs.createReadStream(filePath), { duration: true }, (err, metadata) => {
      if (err) {
        console.error(err);
      }

      let relativePath = filePath.slice(this.path.length, filePath.length);

      if (metadata.title === '' ||
          metadata.artist.length === 0 ||
          metadata.album === '') {
        nextFile();
        return;
      }

      let song = new Song(
        metadata.title,
        metadata.artist[0],
        metadata.album,
        metadata.year,
        metadata.track.no,
        parseInt(metadata.duration),
        relativePath
      );

      let addArtistId = () => {
        return new Promise((fulfill, reject) => {
          this.artists.find({ name: song.artist }, (err, docs) => {
            if (err) {
              reject(err);
            }

            if (docs.length === 1) {
              song.artistId = docs[0]._id;
              fulfill();
            } else {
              this.artists.insert({ name: song.artist }, (err, newDoc) => {
                if (err) {
                  reject(err);
                }

                song.artistId = newDoc._id;
                fulfill();
              });
            }
          });
        });
      };

      let addAlbumId = () => {
        return new Promise((fulfill, reject) => {
          this.albums.find({ name: song.album }, (err, docs) => {
            if (err) {
              reject(err);
            }

            if (docs.length === 1) {
              song.albumId = docs[0]._id;
              fulfill();
            } else {
              this.albums.insert({ name: song.album }, (err, newDoc) => {
                if (err) {
                  reject(err);
                }

                song.albumId = newDoc._id;
                fulfill();
              });
            }
          });
        });
      };

      let insertSong = () => {
        return new Promise((fulfill, reject) => {
          this.library.insert(song, (err) => {
            if (err) {
              reject(err);
            }

            fulfill();
            nextFile();
          });
        });
      };

      addArtistId()
        .then(addAlbumId)
        .then(insertSong)
        .catch(console.error);
    });
  }
}

module.exports = Database;
