
define([
    'jquery',
    'angular'
], function($, angular){

    // Init
    var util = {};



    // Get single view
    util.getView = (function(){

        var currentApp;
        var viewCache = {};
        var $viewTarget = $('#view');

        function bootstrapView(view){

            // Destroy previous view
            if(currentApp){
                // TODO: Confirm this is actually destrolling the current app
                var $rootScope = currentApp.get('$rootScope');
                $rootScope.$destroy();
                $rootScope = null;
                currentApp = null;
            }

            // Insert view markup
            $viewTarget.html(view.markup);


            // Init the sub app
            angular.element(document).ready(function() {
                var target = document.getElementById(view.app.name);
                currentApp = angular.bootstrap(target, [view.app.name]);
            });
        };

        return function(pkg, request){


            // Check cache for view
            if( viewCache.hasOwnProperty(request) ){
                bootstrapView( viewCache[request] );
                return;
            }

            // Get script
            var scriptPath = ('admin' === pkg)? '/static/scripts/views/' : pkg;
            require([scriptPath + '/' + request + '.js'], function(app){

                // Get view
                $.get('/' + pkg + '/views/' + request, function(markup){

                    // Define view
                    var view = {
                        markup: markup,
                        app:    app
                    };

                    // Store markup in cache
                    viewCache[request] = view;

                    // Bootstrap the view
                    bootstrapView(view);
                });
            });

        };
    })();


    // Return utils
    return util;
});










//var appManager = new function () {
//    this.currentAppName;
//    this.currentApp;
//
//    this.startApp = function (appContainerId, appName) {
//        if (this.currentApp) {
//            this.destroyApp(this.currentApp, this.currentAppName);
//        }
//        var appContainer = document.getElementById(appContainerId);
//        if (appContainer) {
//            this.currentAppName = appName;
//            this.currentApp = angular.bootstrap(appContainer, [appName]);
//        }
//    }
//
//    this.destroyApp = function (app, appName) {
//        var $rootScope = app.get('$rootScope');
//        $rootScope.$destroy();
//    }
//}
//
//// Call this when page is ready to rebootsrap app
//appManager.startApp('divContainerId', 'app');