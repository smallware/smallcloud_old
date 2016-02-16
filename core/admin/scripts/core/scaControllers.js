
define([
    './util'
], function(util){

    // Init the collection
    var controllers = {};


    // Toolbar controller
    controllers.ToolbarController = function($mdMedia, $mdSidenav, $scope){

        // Toggle sidenav
        $scope.toggleNav = function () {
            $mdSidenav('sideNav').toggle();
        }

    };


    // Side navigation controller
    controllers.NavController = function($scope){


    }


    return controllers;
});