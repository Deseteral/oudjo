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

### socket.io API

#### Server API
Send this events to the server.

| Event | Action | Description |
|-------|--------|-------------|
| `library` | `shuffle-all` | Clears the queue and adds every songs in the library in random order. |
| `player` | `play` | Starts or resumes the player |
| `player` | `previous` | Plays previous song |
| `player` | `next` | Plays next song |
| `player` | `mute` | Toggles player volume |
| `player` | `stop` | Stops the player |
| `player` | `repeat` | Toggles player repeat function |
| `player` | `volume-change` | Sets players volume where `details.volume` is integer between 0 and 100 (percentage) |
| `player` | `get-status` | Sends player status to the client |

#### Client API
Listen to this events.

| Event | Action | Description |
|-------|--------|-------------|
| `player` | `get-status` | Sends player status in `details.status` object |
| `player` | `get-queue` | Sends collection of songs in player queue |
| `library` | `scanning-progress` | Sends information about library scanning progress |
