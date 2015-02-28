Polymer("oudjo-library", {
    ready: function() {
        var self = this;

        $.get("/library/all", function(data, status) {
            self.data = JSON.parse(data);
        });

        this.$["button-add-all"].onclick = function() {
            $.post("/player/playlist/add/all", function() {
                // Update play queue view after adding all songs
                document.querySelector("oudjo-play-queue").update();
            });
        };
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
