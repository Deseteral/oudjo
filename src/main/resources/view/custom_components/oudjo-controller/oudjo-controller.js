Polymer("oudjo-controller", {
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

        this.$["button-mute"].onclick = function() {
            self.mute(self);
        };

        this.$["volume-slider"].addEventListener("change", function(e) {
            var vol = parseInt(self.$["volume-slider"].value);
            self.updateVolumeServer(self, vol);
        });

        window.setInterval(function() {
            $.get("/player/status", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        }, 500);
    },
    updateStatus: function(self, status) {

        // if the song has changed
        if (self.playerStatus === undefined ||
                self.playerStatus.currentSong.id != status.currentSong.id) {

            self.playerStatus = status;

            self.$["song-title"].innerHTML = status.currentSong.title;
            self.$["song-artist"].innerHTML = status.currentSong.artist;

            self.$["album-art"].src = "/song/" + status.currentSong.id + "/art";

            self.updateVolumeView(self, status.volume);
        }

        if (status.isPlaying) {
            self.$["play-icon"].icon = "av:pause";
            self.$["song-progressbar"].value = status.progress;

            if (status.volume != self.playerStatus.volume) {
                self.updateVolumeView(self, status.volume);
            }
        } else {
            self.$["play-icon"].icon = "av:play-arrow";
        }
    },
    updateVolumeView: function(self, vol) {
        self.$["volume-slider"].value = vol;

        if (vol === 0)
            self.$["button-mute"].icon = "av:volume-off";
        else if (vol > 0 && vol < 33)
            self.$["button-mute"].icon = "av:volume-mute";
        else if (vol >= 33 && vol < 66)
            self.$["button-mute"].icon = "av:volume-down";
        else if (vol >= 66)
            self.$["button-mute"].icon = "av:volume-up";
    },
    updateVolumeServer: function(self, volume) {
        $.post("/player/volume/" + volume, function(data) {
            var status = JSON.parse(data);
            self.updateVolumeView(self, status.volume);
        });
    },
    mute: function(self) {
        var currentVolume = self.$["volume-slider"].value;

        if (currentVolume === 0) {
            self.updateVolumeView(self, self.volumeBeforeMute);
        } else {
            self.volumeBeforeMute = currentVolume;
            self.updateVolumeView(self, 0);
        }
        self.updateVolumeServer(self, self.$["volume-slider"].value);
    },
    volumeBeforeMute: 100,
    playerStatus: undefined
});
