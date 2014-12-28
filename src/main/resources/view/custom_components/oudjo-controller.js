Polymer({
    ready: function() {
        var self = this;

        this.$["button-previous"].onclick = function() {
            $.get("/player/previous", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        };

        this.$["button-play"].onclick = function() {
            $.get("/player/play", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        };

        this.$["button-next"].onclick = function() {
            $.get("/player/next", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        };

        this.$["volume-slider"].addEventListener("change", function(e) {
            var vol = parseInt(self.$["volume-slider"].value);

            $.post("/player/volume/" + vol, function(data) {
                var status = JSON.parse(data);
                self.$["volume-slider"].value = (status.volume * 100);
            });
        });

        window.setInterval(function() {
            $.get("/player/status", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        }, 500);
    },
    updateStatus: function(self, songInfo) {

        if (self.playerStatus === undefined ||
            self.playerStatus.currentSong.id != songInfo.currentSong.id) {

            self.playerStatus = songInfo;

            self.$["song-title"].innerHTML = songInfo.currentSong.title;
            self.$["song-artist"].innerHTML = songInfo.currentSong.artist;
        }

        if (self.playerStatus !== undefined) {

            if (self.playerStatus.isPlaying)
                self.$["play-icon"].icon = "av:pause";
            else
                self.$["play-icon"].icon = "av:play-arrow";
        }
    },
    playerStatus: undefined
});
