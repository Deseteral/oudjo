# oudjo

Cross-platform music player that follows
[Google's Material Design](http://www.design.google.com/) style guidelines.

One of it's unique features is the ability to remote control it using any device
connected to the same network with modern browser installed.

Built using great technologies like:
* [Electron](http://electron.atom.io)
* [Polymer](https://www.polymer-project.org/)
* [socket.io](http://socket.io/)

## API

### REST API

`GET` `/library`

Returns a collection of all songs in the library, sorted
alphabetically.

`GET` `/library/:id/art`

Returns an image with album art for a song that's specified by the `id`
parameter.

`GET` `/player/queue`

Returns collection of songs that are currently in player queue.

#### Example 'collection of songs' response
```json
[
  {
    "title": "1009",
    "artistId": "yn45onRLG6h6Pxom",
    "artist": "Bonobo",
    "albumId": "BcUlAd7f6IN2rp8t",
    "album": "Black Sands",
    "year": "2010",
    "trackNo": 7,
    "length": 271,
    "path": "/Bonobo - Black Sands (2010)/07 - 1009.mp3",
    "_id":"YPJzwIeMd3IPYvOI"
  },
  {
    "title": "Addicted to a Memory",
    "artistId": "7DSGwVgfjUTzAXgi",
    "artist": "Zedd feat. Bahari",
    "albumId": "R5DmdRSxxexaJEhH",
    "album": "True Colors",
    "year": "2015",
    "trackNo": 1,
    "length": 303,
    "path": "/Zedd - True Colors (2015)/Zedd feat. Bahari - Addicted to a Memory.mp3",
    "_id": "to0fQwkat23D6xDx"},
  {
    "title": "All In Forms",
    "artistId": "yn45onRLG6h6Pxom",
    "artist": "Bonobo",
    "albumId": "BcUlAd7f6IN2rp8t",
    "album": "Black Sands",
    "year": "2010",
    "trackNo": 8,
    "length": 292,
    "path": "/Bonobo - Black Sands (2010)/08 - All In Forms.mp3",
    "_id": "xNVGHx2wKJW6RNZf"
  }
]
```
