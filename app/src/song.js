export class Song {
  constructor(title, artist, album, year, track, genre, length, path) {
    this.title = title;

    this.artistId = null;
    this.artist = artist;

    this.albumId = null;
    this.album = album;

    this.year = year;
    this.trackNo = track.no;
    this.trackOf = track.of;
    this.genre = genre;
    this.length = length;

    this.path = path;
  }
}
