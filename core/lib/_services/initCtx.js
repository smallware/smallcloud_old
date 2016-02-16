
var _        = require('lodash');
var fs       = require('fs');
var DepGraph = require('dependency-graph').DepGraph;

// Factory
module.exports = function *(){

  // Setup ////////////////////////////////////////////////////////////////////

  // Service candidates
  var _candidates = yield fs.readdirSync(S.get('config.services.root'));

  // Dependency graph
  var _depGraph = new DepGraph();

  // Private resource store
  var _resources = {
    configs:   yield S.get('models.instances.resources').findAll(),
    providers: {},
    remove:    []
  };

  // Private store
  var _services = {
    configs:   yield S.get('models.instances.services').findAll(),
    instances: {},
    remove:    []
  };


  // Resources ////////////////////////////////////////////////////////////////
  var resources = {

    getProvides: function(servId){
      return _.find(_resources.configs, {provider: servId});
    },

    getConfig: function(){
      if(1 === arguments.length)
        return _resources.configs.filter(function(config){
          return arguments[0] === config.id;
        });
      else if(2 === arguments.length)
        return _.find(_resources.configs, {id: arguments[0], provider: arguments[1]});
      else
        return _resources.configs;
    },

    getProvider: function(){
      if(arguments.length)
        return _resources.providers[arguments[0]];
      else
        return _resources;
    },

    addResource: function(resDef, provider){
      resDef.provider = provider.id;
      var resConf = S.get('models.instances.resources').build(resDef);
      _resources.configs.push(resConf);
    },

    addProvider: function(resDef, provider){
      _resources.providers[resDef.id] = provider;
      resources.addResource(resDef, provider);
    },

    remove: function(servId){
      _resources.configs.filter(function(resConfig){
        return resConfig.provider === servId;
      }).forEach(function(resConfig){
        _resources.remove.push(_.remove(_resources.configs, resConfig));
      });
    }

  };


  // Services /////////////////////////////////////////////////////////////////
  var services = {

    depGraph:     _depGraph,

    addConfig: function(service){
      var config = S.get('models.instances.services').build(_.assign({id: service.id}, service.meta));
      _services.configs.push(config);
    },

    addInstance: function(service){

      // Add service instance
      _services.instances[service.id] = service;

      // Add service to dep graph
      services.depGraph.addNode(service.id);

      // Is this a newly installed service?
      if( services.getConfig(service.id) )
        return;

      // Add new service config
      services.addConfig(service);
    },

    getConfig: function(){
      if(arguments.length)
        return _.find(_services.configs, {id: arguments[0]});
      else
        return _services.configs;
    },

    getInstance: function(servId){
      return _services.instances[servId];
    },

    shouldActivate: function(servId){
      var servConfig = services.getConfig(servId);
      return servConfig.activable && servConfig.active;
    },

    setInactivable: function(service){

      // Update config
      var servConfig = services.getConfig(service.id);
      servConfig.activable = false;

      // Remove resources owned by service
      resources.remove(service.id);

      // Update dep graph
      if( _depGraph.hasNode(service.id) ){
        _depGraph.dependantsOf(service.id).forEach(function(node){
          _depGraph.dependantsOf(service.id).forEach(_depGraph.removeNode);
          _depGraph.removeNode(service.id);
        });
      }
    },

    remove: function(servId){
      _services.remove.push(_.remove(_services.configs, {id: servId}));
      resources.remove(servId);
    }
  };


  // Context facade ///////////////////////////////////////////////////////////
  return {
    // Service candidates
    candidates: _candidates,

    // Service namespace
    services: services,

    // Resources namespace
    resources: resources,

    // Update registries
    update: function(){

      // Get installed services IDs
      var installed = Object.keys(_services.instances);

      // Get configured services IDs
      var configured = _services.configs.map(function(servConfig){
        return servConfig.id;
      });

      // Remove uninstalled services
      configured.forEach(function(servId){
        if( !_.includes(installed, servId) ){
          services.remove(servId);
        }
      });

      // Build preferred services index
      _resources.providers = _resources.configs.filter(function(resConf){
        return resConf.preferred;
      }).reduce(function(out, resConf){
        out[resConf.id] = _services.instances[resConf.provider];
        return out;
      }, {});
    },

    // Persist registries into DB
    persist: function(){

      var saver = function(config){
        // Only save if there are changes
        return ( config.changed() )? config.save() : null;
      };

      var destroyer = function(config){
        return config.destroy();
      };

      // Save configs
      var srvSaves = _services.configs.map(saver);
      var resSaves = _resources.configs.map(saver);

      // Remove uninstalled
      var srvRemoves = _.flatten(_services.remove).map(destroyer);
      var resRemoves = _.flatten(_resources.remove).map(destroyer);

      // Return promises
      return [srvSaves, resSaves, srvRemoves, resRemoves];
    }
  };
};