
var requireAll = require('require-all');
var dbUtil     = require('../../util/database');
var _          = require('lodash');


module.exports = {

  // Load provided resources
  load: function(manifest, path){

    // Load handlers
    try{
      var handlers = requireAll(path + '/resources');
    }catch(err){
      return {};
    }

    // Get provided handler's IDs
    var providedIds = manifest.resources.provides.map(function(res){
      return res.id;
    });

    // Iterate handlers
    var resources =_.reduce(handlers, function(_resources, _handlers, resId){

      if( _.includes(providedIds, resId) ){
        var provDef = _.find(_resources.provides, {id: resId});
        provDef.handlers = handlers[resId];
      }else{
        if(_.isPlainObject(_resources.middleware))
          _resources.middleware[resId] = handlers[resId];
        else{
          _resources.middleware = {};
          _resources.middleware[resId] = handlers[resId];
        }
      }

      return _resources;
    }, manifest.resources);

    return {resources: resources};
  }
};