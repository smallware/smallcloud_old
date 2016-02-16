
var requireAll = require('require-all');
var dbUtil     = require('../../util/database');
var _          = require('lodash');

module.exports = {

  // Load provided model definitions
  load: function(service){

    // Setup
    var out = {};

    try{

      // Load definitions
      out.models = {
        definitions: requireAll(service.meta.path + '/models'),
        instances:   {}
      };

    }catch(err){
      if( 'ENOENT' === err.code )
        S.log('debug', 'Service ' + service.meta.name + ' has no models');
    }

    return out;
  },

  // Create model instances from definitions
  create: function(service){

    // TODO: Activate only models for preferred resources

    // Does the service have any model definitions?
    if( !service.models || !service.models.definitions)
      return;

    // Instantiate models
    service.models.instances = dbUtil.createModels(service.models.definitions);

  }
};