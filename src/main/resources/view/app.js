window.addEventListener("polymer-ready", function(e) {

    $("#navicon")[0].addEventListener("click", function() {
        $("#drawer-panel")[0].togglePanel();
    });

    $("oudjo-controller")[0].addEventListener("volume-slider-touch", function(e) {

        if (e.detail)
            $("#controller-drawer")[0].disableSwipe = true;
        else
            $("#controller-drawer")[0].disableSwipe = false;
    });

    hideFakeToolbar();
});

$(window).resize(function() {
    hideFakeToolbar();
});

function hideFakeToolbar() {
    var drawer = $("#controller-drawer");
    var fakeToolbar = $("#controller-drawer div[drawer] core-toolbar");

    if (drawer[0].narrow) {
        fakeToolbar[0].style.opacity = "0.0";
    } else {
        fakeToolbar[0].style.opacity = "1.0";
    }
}
