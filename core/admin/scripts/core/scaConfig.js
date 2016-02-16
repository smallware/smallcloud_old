
define([
    '../lib/Menu'
], function(Menu){


    // Configuration function
    return [
        '$mdThemingProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$controllerProvider',
        '$locationProvider',
        function($mdThemingProvider, $stateProvider, $urlRouterProvider, $controllerProvider, $locationProvider) {

            // Material design theme config
            $mdThemingProvider.theme('default')
                .primaryPalette('grey')
                .accentPalette('teal', {
                    'default': '500'
                });


            // Get the main menu
            var mainMenu = Menu.getMenu();

            // Set location type
            // TODO: Activate html5mode (base tag error)
            //$locationProvider.html5Mode(true);

            // Set first meu item as default state/route
            $urlRouterProvider.otherwise(mainMenu[0].id);


            // State builder function
            var buildStates = function(menuItems){

                // Iterate menu items
                menuItems.forEach(function(item){

                    // Build params
                    var viewPath = (item.parent)? '/' + item.parent + '/'+item.id : '/'+item.id;
                    var tmplUrl  = '/' + item.pkg + '/views/' + item.id + '.html';
                    var ctrlUrl  = '/' + item.pkg + '/scripts/views/' + item.id + '.js';
                    var ctrlName = item.id + 'Controller';
                    var resolver = {
                        ctrlLoader: ['$q', function($q){

                            // Init promise
                            var deferred = $q.defer();

                            // Fetch the controller function
                            require([ctrlUrl], function(ctrlFn){

                                // Register the controller
                                $controllerProvider.register(ctrlName, ctrlFn);

                                // Resolve the promise
                                deferred.resolve();
                            });

                            // Return promise
                            return deferred.promise;
                        }]
                    };

                    // Register state
                    $stateProvider.state(item.id, {
                        url:         viewPath,
                        templateUrl: tmplUrl,
                        item:        item,
                        controller:  ctrlName,
                        resolve:     resolver
                    });

                    // Does the item have children?
                    if(item.children && 0 < item.children.length){
                        // Recur on children
                        buildStates(item.children);
                    }

                }, this);
            };


            // Register router states
            buildStates(mainMenu);


    }];
});