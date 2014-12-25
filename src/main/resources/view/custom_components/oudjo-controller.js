Polymer({
    ready: function() {

        var self = this;

        this.$["button-previous"].onclick = function() {
            $.get("/player/previous", function(data, status) {
                self.updateSongInfo(self, JSON.parse(data));
            });
        };

        this.$["button-play"].onclick = function() {
            $.get("/player/play", function(data, status) {
                self.updateSongInfo(self, JSON.parse(data));
            });
        };

        this.$["button-next"].onclick = function() {
            $.get("/player/next", function(data, status) {
                self.updateSongInfo(self, JSON.parse(data));
            });
        };
    },
    updateSongInfo: function(self, songInfo) {
        self.$["song-title"].innerHTML = songInfo.currentSong.title;
        self.$["song-artist"].innerHTML = songInfo.currentSong.artist;
    }
});
