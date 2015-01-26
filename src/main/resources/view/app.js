window.addEventListener("polymer-ready", function(e) {

    var navicon = $("#navicon")[0];
    var drawerPanel = $("#drawer-panel")[0];
    var oudjoController = $("oudjo-controller")[0];
    var controllerDrawer = $("#controller-drawer")[0];

    navicon.addEventListener("click", function() {
        drawerPanel.togglePanel();
    });

    oudjoController.addEventListener("volume-slider-touch", function(e) {

        if (e.detail) {
            controllerDrawer.disableSwipe = true;
        } else {
            controllerDrawer.disableSwipe = false;
        }
    });

    controllerDrawer.addEventListener("core-select", function() {
        $("#controller-drawer::shadow core-selector #drawer")[0]
            .style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    });

    hideFakeToolbar();
});

$(window).resize(function() {
    hideFakeToolbar();
});

/*
 * Check if fake toolbar above oudjo-controller needs to be hidden.
 *
 * When controller drawer is not in narrow mode (e.g. on desktop), opacity of fake toolbar
 *   must be set to 100%.
 * When controller drawer is narrow (e.g. on smartphones), opacity of fake toolbar must be
 *   set to 0%.
 */
function hideFakeToolbar() {
    var drawer = $("#controller-drawer")[0];
    var fakeToolbar = $("#controller-drawer div[drawer] core-toolbar")[0];

    if (drawer.narrow) {
        fakeToolbar.style.opacity = "0.0";
    } else {
        fakeToolbar.style.opacity = "1.0";
    }
}
