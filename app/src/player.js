const path = require('path');
const events = require('events');

import { Song } from './song';

export class Player {
  constructor(audioElement, databasePath) {
    this.audio = audioElement;
    this._databasePath = databasePath;

    this.queue = [];
    this.currentSong = 0;

    this.playbackProgress = 0.0;

    this.muted = false;
    this._oldVolume = 1.0;

    this.repeat = false;

    this.eventEmitter = new events.EventEmitter();

    this.audio.addEventListener('ended', () => {
      if (this.currentSong === this.queue.length - 1) {
        if (this.repeat) {
          this.next();
        }
      } else {
        this.next();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.playbackProgress = this.audio.currentTime / this.audio.duration;
      this.eventEmitter.emit('playback-progress');
    });
  }

  getCurrentSong() {
    return this.queue[this.currentSong];
  }

  isPlaying() {
    return !this.audio.paused;
  }

  _loadCurrentSong() {
    if (this.queue.length === 0) {
      console.error(
        'Couldn\'t load current song, there are no songs in the queue'
      );
      return;
    }

    this.audio.src = path.join(
      this._databasePath, this.queue[this.currentSong].path
    );

    this.eventEmitter.emit('song-changed');
  }

  play() {
    // If there's nothing to play - return
    if (this.queue.length === 0) {
      return;
    }

    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }

    this.eventEmitter.emit('playback-state-changed');
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0.0;

    this.eventEmitter.emit('playback-state-changed');
  }

  next() {
    this.currentSong++;

    if (this.currentSong >= this.queue.length) {
      this.currentSong = 0;
    }

    this._loadCurrentSong();
    this.play();
  }

  previous() {
    this.currentSong--;

    if (this.currentSong < 0) {
      this.currentSong = (this.queue.length - 1);
    }

    this._loadCurrentSong();
    this.play();
  }

  setVolume(volume) {
    if (this.audio.volume !== volume) {
      this.audio.volume = volume;
      this.eventEmitter.emit('volume-changed');
    }
  }

  getVolume() {
    return this.audio.volume;
  }

  mute() {
    if (!this.muted) {
      this._oldVolume = this.audio.volume;
      this.audio.volume = 0.0;
      this.muted = true;
    } else {
      this.audio.volume = this._oldVolume;
      this.muted = false;
    }

    this.eventEmitter.emit('volume-changed');
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
  }

  shuffleQueue() {
    // If queue has zero or one song, don't shuffle
    if (this.queue.length < 2) {
      return;
    }

    let isPlaying = !this.audio.paused;

    // Save reference to current song
    let temp = this.queue[this.currentSong];

    // Remove current song
    if (isPlaying) {
      this.queue.splice(this.currentSong, 1);
    }

    // Shuffle the queue
    shuffleArray(this.queue);

    // Put current song at the beggining of the queue, or load new current song
    if (isPlaying) {
      this.queue.unshift(temp);
      this.currentSong = 0;
    } else {
      this._loadCurrentSong();
    }
  }

  addToQueue(songs) {
    // If queue is empty - load first song
    let load = (this.queue.length === 0);

    switch (songs.constructor) {
      case Array:
        this.queue = this.queue.concat(songs);
        break;

      case Song:
        this.queue = this.queue.push(songs);
        break;

      default:
        console.error('Invalid argument');
    }

    if (load) {
      this._loadCurrentSong();
    }
  }

  addToQueueNext(songs) {
    // If queue is empty - load first song
    let load = (this.queue.length === 0);

    let beggining = this.queue.splice(0, this.currentSong + 1);

    switch (songs.constructor) {
      case Array:
        beggining = beggining.concat(songs);
        break;

      case Song:
        beggining = beggining.push(songs);
        break;

      default:
        console.error('Invalid argument');
    }

    // Concat beggining and end into final queue
    this.queue = beggining.concat(this.queue);

    if (load) {
      this._loadCurrentSong();
    }
  }

  clearQueue() {
    this.queue = [];
    this.currentSong = 0;
    this.audio.src = '';
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
