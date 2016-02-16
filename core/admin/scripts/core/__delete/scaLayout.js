
// Fit SmallCloud admin layout into window
define(['jquery'], function($){

    // Fetch nodes
    var $window  = $(window);
    var $core    = $('#core');
    var $view    = $('#view');

    // Fetch layout nodes
    var $toolbar = $core.find('#toolbar');
    var $sideNav = $core.find('#sideNav');

    // Get dimentions
    var toolbarHeight = $toolbar.outerHeight();
    var sideNavWidth  = $sideNav.outerWidth();
    var BREAKPOINT    = 960;

    // Fit layout into window
    var frameFit = function () {

        var winWidth  = $window.width();
        var winHeight = $window.height();

        // Fit main
        $sideNav.css({
            height: $window.height(),
            paddingTop: toolbarHeight
        });

        // Fit view
        $view.css({
            top:    toolbarHeight,
            left:   (winWidth >= BREAKPOINT)? sideNavWidth : 0,
            height: winHeight - toolbarHeight,
            width:  (winWidth >= BREAKPOINT)? winWidth - sideNavWidth : '100%',
        });
    };

    return function () {

        // Run on creation
        frameFit();

        // Run on resize
        $window.resize(frameFit);
    };
});