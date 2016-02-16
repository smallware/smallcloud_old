
define([
    'jquery',
    'core/util',
    '../lib/Menu'
], function($, util, Menu){

    // Init the collection
    var directives = {};

    directives.scaAutoHeight = {
        restrict: 'A',
        link: function(scope, elem, atts){

            // Update parent container height
            scope.updateHeight(elem.outerHeight());
        }
    };

    // Menu branch
    directives.scaMenuBranch = {
        restrict: 'E',
        replace: true,
        templateUrl: '/core/templates/scaMenuBranch.html',
        link: function(scope, $elem, atts){

            var $children = $elem.children('md-list');
            var counter   = 1;

            // Update the height of the children container
            scope.updateHeight = function(height){

                // Update height
                $children.css('height', height * counter);

                // Increment
                counter++;
            };

        }
    };

    // Menu directive
    directives.scaMenu = {
        restrict: 'E',
        replace: true,
        templateUrl: '/core/templates/scaMenu.html',
        controller: ['$scope', '$state', function($scope, $state, $rootScope){

            // Update menu on route request
            $scope.$on('$stateChangeSuccess', function(event, state){

                // Activate requested menu item
                Menu.setActive(state.item);
            });

            // Insert menu into scope
            $scope.menu = Menu.getMenu();

            // Handle item click
            $scope.request = function(item){

                // Activate clicked item
                Menu.setActive(item);

                // Update state
                $state.go(item.id)
            };

        }]
    };



    return directives;
});