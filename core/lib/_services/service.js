
var _          = require('lodash');
var path       = require('path');
var requireAll = require('require-all');
var components = requireAll(path.resolve(__dirname, './components'));
//var router     = require('../router');

// Service factory
module.exports = function(manifest, id){

  // Debug log
  S.log('debug', 'Registering service ' + id);

  // Setup
  var servicePath = [S.get('config.services.root'), id].join('/');
  var packagePath = [servicePath, 'package.json'].join('/');
  var servObject  = (function(path){
      try{
        return require(path);
      }catch(err){
        S.log('debug', manifest.name + ' has no main object');
        return {};
      }
    })(servicePath);


  // Create the service
  // TODO: Event emitter?
  var service = {id: id, meta: {path: servicePath}};

  // Load service meta
  _.assign(service.meta, _.omit(manifest, 'resources'), _.omit(require(packagePath), 'scripts', 'main'));

  // Load service methods
  _.assign(service, _.omit(servObject, Object.keys(components.lifecycle)));

  // Load lifecycle functions
  _.assign(service, components.lifecycle(service, servObject));

  // Load model definitions
  _.assign(service, components.models.load(service));

  // Load resources
  _.assign(service, components.resources.load(manifest, servicePath));


  // Done
  return service;

};