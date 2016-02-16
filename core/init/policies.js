
var _          = require('lodash');
var langUtil   = require('../lib/util/lang');
//var Policies   = require('../lib/resources/policies');

module.exports = function(cb){ cb() };
var xxx = ['database', 'services', 'resources', function(callback){

  // Verbose
  S.log('verbose', 'Loading policies...');

  langUtil.genCallback(function *(){

    // Initialize policy manager
    var polManager = yield Policies();

    // Register policy manager
    S.set('policies', polManager);

    // Add custom core policies
    polManager.addPolicies('users', 'admin', {
      fetch:  true,
      create: true,
      update: true,
      remove: true
    });

    polManager.addPolicies('users', 'users', {
      fetch:  true,
      create: false,
      update: true,
      remove: false
    });

    polManager.addPolicies('users', 'guests', {
      fetch:  false,
      create: false,
      update: false,
      remove: false
    });


    // XXX
    //var xSesId = Date.now();
    //polManager.addSession(xSesId, 'admin');
    //
    //console.log('>>> ALLOWED:', polManager.isAllowed(xSesId, 'resource01', 'create'));




  }, callback);

  //callback();
}];