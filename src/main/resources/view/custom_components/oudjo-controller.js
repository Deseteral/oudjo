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
                self.$["volume-slider"].value = status.volume;
            });
        });

        window.setInterval(function() {
            $.get("/player/status", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        }, 500);
    },
    updateStatus: function(self, status) {

        console.log(status);

        if (self.playerStatus === undefined ||
            self.playerStatus.currentSong.id != status.currentSong.id) {

            self.playerStatus = status;

            self.$["song-title"].innerHTML = status.currentSong.title;
            self.$["song-artist"].innerHTML = status.currentSong.artist;
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
