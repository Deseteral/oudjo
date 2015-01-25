$(document).ready(function() {

    $("#navicon")[0].addEventListener("click", function() {
        $("#drawer-panel")[0].togglePanel();
    });

    $("oudjo-controller")[0].addEventListener("volume-slider-touch", function(e) {

        if (e.detail)
            $("#controller-drawer")[0].disableSwipe = true;
        else
            $("#controller-drawer")[0].disableSwipe = false;
    });
});
