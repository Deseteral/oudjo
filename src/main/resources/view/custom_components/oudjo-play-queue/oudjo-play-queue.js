Polymer("oudjo-play-queue", {
    ready: function() { },
    update: function() {
        var library = document.querySelector("oudjo-library").data;

        var self = this;

        $.get("/player/playlist", function(data, status) {
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
    }
});
