
// Set bower components path
var bowerPath = '/core/bower_components'

// Configure RequireJS
requirejs.config({
    paths: {
        // Plugins
        'text':                 bowerPath + '/requirejs-text/text',

        // Libraries
        'jquery':               bowerPath + '/jquery/dist/jquery.min',
        'pathjs':               bowerPath + '/pathjs/path.min',
        'angular':              bowerPath + '/angular/angular',
        'angular-animate':      bowerPath + '/angular-animate/angular-animate.min',
        'angular-aria':         bowerPath + '/angular-aria/angular-aria.min',
        'angular-material':     bowerPath + '/angular-material/angular-material.min',
        'angular-ui-router':    bowerPath + '/angular-ui-router/release/angular-ui-router.min',
        'Chartjs':              bowerPath + '/Chart.js/Chart.min',
        'tc-angular-chartjs':   bowerPath + '/tc-angular-chartjs/dist/tc-angular-chartjs.min'
    },
    shim: {
        'jquery':               { exports: '$' },
        'pathjs':               { exports: 'Path' },
        'angular-animate':      { deps: ['angular'] },
        'angular-aria':         { deps: ['angular'] },
        'angular-material':     { deps: ['angular', 'angular-animate', 'angular-aria'] },
        'angular-ui-router':    { deps: ['angular'] },
        'tc-angular-chartjs':   { deps: ['angular', 'Chartjs'] },
        'angular':              {
            deps:    ['jquery'],
            exports: 'angular'
        }
    }
});



require([
    'angular',
    'core/scaConfig',
    'core/scaServices',
    'core/scaControllers',
    'core/scaDirectives',
    'angular-material',
    'angular-ui-router'
], function(angular, scaConfig, scaServices, scaControllers, scaDirectives){

    // Setup the admin app
    var admin = angular.module('SmallCloudAdmin', [
        'ngAnimate',
        'ngMaterial',
        'ui.router'
    ]);

    // Configure admin app
    admin.config(scaConfig);

    // Register services
    Object.keys(scaServices).forEach(function(servName){
        admin.service(servName, scaServices[servName]);
    });

    // Register controllers
    Object.keys(scaControllers).forEach(function(ctrlName){
        admin.controller(ctrlName, scaControllers[ctrlName]);
    });

    // Register directives
    Object.keys(scaDirectives).forEach(function(dirName){
        admin.directive(dirName, function(){
            return scaDirectives[dirName];
        });
    });


    // Init admin app
    angular.element(document).ready(function() {
        var target = document.getElementById("admin");
        angular.bootstrap(target, ['SmallCloudAdmin']);
    });

});