$(document).ready(function() {

    $("oudjo-controller")[0].addEventListener("volume-slider-touch", function(e) {

        if (e.detail)
            $("#controller-drawer")[0].disableSwipe = true;
        else
            $("#controller-drawer")[0].disableSwipe = false;
    });
});
