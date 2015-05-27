
function Player(audio) {
  this.audio = audio;

  this.playlist = [];
  this.currentSong = 0;
  this.volume = 1.0;
  this.repeat = false;
}

Player.prototype.play = function() {
};

Player.prototype.stop = function() {
};

Player.prototype.pause = function() {
};

Player.prototype.next = function() {
};

Player.prototype.previous = function() {
};

Player.prototype.mute = function() {
};

Player.prototype.shuffle = function() {
};

module.exports = Player;
