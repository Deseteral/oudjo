Polymer("oudjo-controller", {
    ready: function() {
        var self = this;

        // Media control buttons
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

        // Mute button
        this.$["button-mute"].onclick = function() {
            self.mute(self);
        };

        // User changes volume slider value
        this.$["volume-slider"].addEventListener("change", function(e) {
            var vol = parseInt(self.$["volume-slider"].value);
            self.updateVolumeServer(self, vol);
        });

        // When user is using volume slider
        this.$["volume-slider"].addEventListener("up", function(e) {
            self.isVolumeSliderTouched = false;

            var event = new CustomEvent("volume-slider-touch",
                { "detail": false });

            self.dispatchEvent(event);
        });

        this.$["volume-slider"].addEventListener("down", function(e) {
            self.isVolumeSliderTouched = true;

            var event = new CustomEvent("volume-slider-touch",
                { "detail": true });

            self.dispatchEvent(event);
        });
    },
    updateStatus: function(self, status) {

        // If the song has changed
        if (self.playerStatus === undefined ||
                self.playerStatus.currentSong.id != status.currentSong.id) {

            self.playerStatus = status;

            // Change title and artist info
            self.$["song-title"].innerHTML = status.currentSong.title;
            self.$["song-artist"].innerHTML = status.currentSong.artist;

            // Update album art
            var albumArt = self.$["album-art"];
            var artUrl = "/song/" + status.currentSong.id + "/art";

            // Check if album art is available
            urlExists(artUrl, function(status) {

                // Setup current album art as placeholder
                albumArt.placeholder = albumArt.src;

                // Load album art if it exists, if not use oudjo graphics as replacement
                if (status !== 404) {
                    albumArt.src = artUrl;
                } else {
                    albumArt.src = "../../res/oudjo-album-art.png";
                }
            });

            // Update volume slider
            self.updateVolumeView(self, status.volume);
        }

        // Is there's song playing
        if (status.isPlaying) {

            // Change play button icon to pause
            self.$["play-icon"].icon = "av:pause";

            // Update progress bar
            self.$["song-progressbar"].value = status.progress;

            // If the volume has changed, update it
            if (status.volume != self.playerStatus.volume) {
                self.updateVolumeView(self, status.volume);
            }
        } else {
            // If the there's no song playing change icon of play button to play arrow
            self.$["play-icon"].icon = "av:play-arrow";
        }
    },
    updateVolumeView: function(self, vol) {
        // Update slider value
        self.$["volume-slider"].value = vol;

        var muteButton = self.$["button-mute"];

        // Set appropriate icon on mute button depending on volume sliders value
        if (vol === 0)
            muteButton.icon = "av:volume-off";
        else if (vol > 0 && vol < 33)
            muteButton.icon = "av:volume-mute";
        else if (vol >= 33 && vol < 66)
            muteButton.icon = "av:volume-down";
        else if (vol >= 66)
            muteButton.icon = "av:volume-up";
    },
    updateVolumeServer: function(self, volume) {
        // Send new volume slider value to the server
        $.post("/player/volume/" + volume, function(data) {
            var status = JSON.parse(data);
            self.updateVolumeView(self, status.volume);
        });
    },
    mute: function(self) {
        var volumeSlider = self.$["volume-slider"];
        var currentVolume = volumeSlider.value;

        // If it's muted, restore previous value
        if (currentVolume === 0) {
            self.updateVolumeView(self, self.volumeBeforeMute);
        } else {
            // Save current value, and set new one to 0
            self.volumeBeforeMute = currentVolume;
            self.updateVolumeView(self, 0);
        }
        self.updateVolumeServer(self, volumeSlider.value);
    },
    start: function(self) {
        // Every 50ms get update from server
        window.setInterval(function() {
            $.get("/player/status", function(data, status) {
                self.updateStatus(self, JSON.parse(data));
            });
        }, 50);
    },
    volumeBeforeMute: 100,
    playerStatus: undefined,
    isVolumeSliderTouched: false
});
