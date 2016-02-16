
var _          = require('lodash');
var models     = require('./models');
var resources  = require('../../resources');


// Publics ////////////////////////////////////////////////////////////////////
module.exports = function(service, servMethods){

  return {

    activate: function *(persist){

      // TODO: Revisar la activación

      // Debug log
      S.log('debug', 'Activating service ' + service.meta.name);

      // Run service init?
      if( 'init' in servMethods )
        yield servMethods.init();


      // Create model instances
      models.create(service);

      // Register service resources in router
      resources.register(service);


      // Run service startup?
      if( 'activate' in servMethods )
        yield servMethods.activate();

      // Persist activation?
      if( persist ){
        yield S.get('models.Services').findById(service.id).then(function(servConfig){
          return servConfig.update({active: true});
        });
      }

      // Chaining
      return service;
    },

    deactivate: function *(persist){

      // Debug log
      S.log('debug', 'Deactivating service ' + manifest.name);

      // Run service startup?
      if( 'deactivate' in servMethods )
        yield servMethods.deactivate();

      // Persist deactivation?
      if( persist ){
        yield S.get('models.Services').findById(service.id).then(function(servConfig){
          return servConfig.update({active: false});
        });
      }

      // Chaining
      return service;
    },

    shutdown: function *(){

      // Debug log
      S.log('debug', 'Shutting down service ' + manifest.name);

      // Run service startup?
      if( 'shutdown' in servMethods )
        yield servMethods.shutdown();


      // Chaining
      return service;
    }
  };
};