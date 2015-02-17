Polymer("oudjo-library", {
    ready: function() {
        var self = this;

        $.get("/library/all", function(data, status) {
            self.data = JSON.parse(data);
        });
    },
    addToPlaylist: function(event, detail, sender) {
        var id = sender.id;
        id = id.substring(5, id.length);

        $.post("/player/playlist/add/" + id, function() {
            // Update play queue view after adding a new song
            document.querySelector("oudjo-play-queue").update();
        });
    }
});
