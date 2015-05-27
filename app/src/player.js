var Song = require('./song');

function Player(audio) {
  this.audio = audio;

  this.queue = [];
  this.currentSong = 0;

  this.isMuted = false;
  this._oldVolume = 1.0;

  this.repeat = false;

  this.audio.addEventListener('ended', function() {
    if (this.currentSong === this.queue.length - 1) {
      if (this.repeat) {
        this.next();
      }
    } else {
      this.next();
    }
  }.bind(this));
}

Player.prototype._loadCurrentSong = function() {
  if (this.queue.length === 0) {
    console.error('There are no songs in the queue');
    return;
  }

  this.audio.src = this.queue[this.currentSong].path;
};

Player.prototype.play = function() {
  this.audio.play();
};

Player.prototype.stop = function() {
  this.audio.pause();
  this.audio.currentTime = 0.0;
};

Player.prototype.pause = function() {
  this.audio.pause();
};

Player.prototype.next = function() {
  this.currentSong += 1;

  if (this.currentSong >= this.queue.length) {
    this.currentSong = 0;
  }

  this._loadCurrentSong();
  this.play();
};

Player.prototype.previous = function() {
  this.currentSong -= 1;

  if (this.currentSong < 0) {
    this.currentSong = (this.queue.length - 1);
  }

  this._loadCurrentSong();
  this.play();
};

Player.prototype.mute = function() {
  if (!this.isMuted) {
    this._oldVolume = this.audio.volume;
    this.audio.volume = 0.0;
    this.isMuted = true;
  } else {
    this.audio.volume = this._oldVolume;
    this.isMuted = false;
  }
};

Player.prototype.shuffle = function() {

  // If queue has zero or one song, don't shuffle
  if (this.queue.length < 2) {
    return;
  }

  // Save reference to current song
  var temp = this.queue[this.currentSong];

  // Remove current song
  this.queue.splice(this.currentSong, 1);

  // Shuffle the queue
  shuffleArray(this.queue);

  // Put current song at the begging of the queue
  this.queue.unshift(temp);
  this.currentSong = 0;
};

Player.prototype.addToQueue = function(songs) {

  // If queue is empty - load first song
  var load = (this.queue.length === 0);

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
};

Player.prototype.addToQueueNext = function(songs) {

  // If queue is empty - load first song
  var load = (this.queue.length === 0);

  var beggining = this.queue.splice(0, this.currentSong + 1);

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
};

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

module.exports = Player;
