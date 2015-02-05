Polymer("oudjo-library", {
    ready: function() {
        var self = this;

        $.get("/library/all", function(data, status) {
            self.data = JSON.parse(data);
            console.log(self.data);
        });
    }
});
