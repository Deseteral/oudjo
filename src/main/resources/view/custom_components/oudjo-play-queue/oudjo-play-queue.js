Polymer("oudjo-play-queue", {
    ready: function() {
        var self = this;

        this.$["button-shuffle"].onclick = function() {
            $.post("/player/queue/shuffle", function() {
                // Update play queue view after shuffling songs
                document.querySelector("oudjo-play-queue").update();
            });
        };
    },
    update: function() {
        var self = this;

        var library = document.querySelector("oudjo-library").data;

        $.get("/player/queue", function(data, status) {
            var ids = JSON.parse(data);
            self.data = [];

            for (var i = 0; i < ids.length; i++) {
                var sid = ids[i];

                for (var k = 0; k < library.length; k++) {
                    if (library[k].id == sid) {
                        self.data.push(library[k]);
                    }
                }
            }
        });
    },
    removeFromQueue: function(event, detail, sender) {
        var self = this;

        var index = sender.parentNode.id;
        index = index.split("-")[2];

        $.post("/player/queue/remove/" + index, function() {
            self.update();
        });
    }
});
