
function Song(title, artist, album, year, path) {
  this.title = title;
  this.artistId = null;
  this.artist = artist;
  this.albumId = null;
  this.album = album;
  this.year = year;
  this.path = path;
}

module.exports = Song;