Polymer({
    ready: function() {
        console.log($("paper-shadow")[0]);
    },
    onPreviousPress: function() {
        $.get("/player/previous");
    },
    onPlayPress: function() {
        $.get("/player/play");
    },
    onNextPress: function() {
        $.get("/player/next");
    }
});
