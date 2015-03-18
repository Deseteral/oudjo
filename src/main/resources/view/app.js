window.addEventListener("polymer-ready", function(e) {

    var app = document.querySelector("#app");
    app.addEventListener("template-bound", function() {

        app.page = "library";
        app.pageChanged = function(e, detail) {
            if (detail.isSelected)
                app.pageLabel = detail.item.label;
        };

        var navicon = document.querySelector("#navicon");
        var drawerPanel = document.querySelector("#drawer-panel");
        var oudjoController = document.querySelector("oudjo-controller");
        var oudjoPlayQueue = document.querySelector("oudjo-play-queue");
        var controllerDrawer = document.querySelector("#controller-drawer");
        var openControllerButton = document.querySelector("#open-controller-button");

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

        windowResize();
        
        // Every 50ms get update from server
        window.setInterval(function() {
            oudjoController.update();
            oudjoPlayQueue.update();
        }, 50);
    });
});

function windowResize() {
    hideFakeToolbar();
}

$(window).resize(function() {
    windowResize();
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
    // var drawer = document.querySelector("#controller-drawer");
    var app = document.querySelector("#app");
    var fakeToolbar = document.querySelector("#controller-drawer core-header-panel[drawer] core-toolbar");
    var controllerHeaderPanel = document.querySelector("#controller-drawer core-header-panel[drawer]");
    var oudjoController = document.querySelector("oudjo-controller");

    if (app.narrow) {
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
