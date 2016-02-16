
var _    = require('lodash');
var data = require('./data/providers');


// Routing table
var _routingTable = {};

// Available actions
var _actions = ['fetch', 'create', 'update', 'remove'];


// Router
module.exports = {

  // Getters //////////////////////////////////////////////////////////////////

  // TODO: Remove, only for dev purposes
  get: function(){
    return _routingTable;
  },

  getActions: function(resId, service){

    // Get actions for model-less resources?
    if( _.includes(service.models.instances, resId) && _routingTable[resId].provider )
      return Object.keys(_routingTable[resId].provider);
    else
      return _actions;

  },

  getProvider: function(resId, action){
    var path = [resId, 'provider', action].join('.');
    return _.get(_routingTable, path, null);
  },

  getMiddleware: function(resId, action){
    var path       = [resId, 'middleware', action].join('.');
    var middleware = _.get(_routingTable, path, null);
    return _.pluck(_.indexBy(middleware, 'priority'), 'handler').reverse();
  },

  getData: function(resId, action){
    var path = [resId, 'data', action].join('.');
    return _.get(_routingTable, path, null);
  },


  // Setters //////////////////////////////////////////////////////////////////

  regMiddleware: function(middleware, resId){

    _.forEach(middleware, function(fn, action){

      // Build path
      var path = [resId, 'middleware', action].join('.');

      // Get registered middlewares for resource
      var middlewares = _.get(_routingTable, path, []);

      // Register new middleware
      middlewares.push({
        priority: 100, // TODO: Provide a sorting priority
        handler:  fn
      });

      // Make sure middleware is stored
      _.set(_routingTable, path, middlewares);

    });
  },

  regProvider: function(resId, action, provider){

    // Build path
    var path = [resId, 'provider', action].join('.');

    // Set provider
    _.set(_routingTable, path, provider);
  },

  regDataProvider: function(provider, service){

    // Resource is model-backed?
    if(!service.models.instances[provider.id])
      return;

    // Iterate possible actions
    _actions.forEach(function(action){

      // Build path
      var path = [provider.id, 'data', action].join('.');

      // Set provider
      _.set(_routingTable, path, data[action]);
    });
  }

};