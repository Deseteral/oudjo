Polymer({
    ready: function() {
    },
    updateSongInfo: function(self, songInfo) {
        self.$["song-title"].innerHTML = songInfo.currentSong.title;
        self.$["song-artist"].innerHTML = songInfo.currentSong.artist;
    },
    onPreviousPress: function() {
        var self = this;

        $.get("/player/previous", function(data, status) {
            self.updateSongInfo(self, JSON.parse(data));
        });
    },
    onPlayPress: function() {
        var self = this;

        $.get("/player/play", function(data, status) {
            self.updateSongInfo(self, JSON.parse(data));
        });
    },
    onNextPress: function() {
        var self = this;

        $.get("/player/next", function(data, status) {
            self.updateSongInfo(self, JSON.parse(data));
        });
    }
});
