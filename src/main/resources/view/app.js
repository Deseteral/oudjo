window.addEventListener("polymer-ready", function(e) {

    var navicon = $("#navicon")[0];
    var drawerPanel = $("#drawer-panel")[0];
    var oudjoController = $("oudjo-controller")[0];
    var controllerDrawer = $("#controller-drawer")[0];
    var openControllerButton = $("#open-controller-button")[0];

    navicon.addEventListener("click", function() {
        drawerPanel.togglePanel();
    });

    openControllerButton.addEventListener("click", function() {
        controllerDrawer.togglePanel();
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
 *   must be set to 100%, the mode of the header panel set to 'standard', and
 *   oudjo-controller top offset set to 0px.
 * When controller drawer is narrow (e.g. on smartphones), opacity of fake toolbar must be
 *   set to 0%, the mode of the header panel set to 'cover', and oudjo-controller top
 *   offset set to 64px (height of the toolbar);
 */
function hideFakeToolbar() {
    var drawer = $("#controller-drawer")[0];
    var fakeToolbar = $("#controller-drawer core-header-panel[drawer] core-toolbar")[0];
    var controllerHeaderPanel = $("#controller-drawer core-header-panel[drawer]")[0];
    var oudjoController = $("oudjo-controller")[0];

    if (drawer.narrow) {
        fakeToolbar.style.opacity = "0.0";

        controllerHeaderPanel.mode = "cover";
        oudjoController.style.top = "64px";
    } else {
        fakeToolbar.style.opacity = "1.0";

        controllerHeaderPanel.mode = "standard";
        oudjoController.style.top = "0px";
    }
}

function urlExists(url, cb) {
    jQuery.ajax({
        url: url,
        dataType: 'text',
        type: 'GET',
        complete: function(xhr) {
            if (typeof cb === 'function')
                cb.apply(this, [xhr.status]);
        }
    });
}
