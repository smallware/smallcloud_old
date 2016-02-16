
var _ = require('lodash');


// Routing table
var _routingTable = {};

// Router
var router = module.exports = {

  // Getters //////////////////////////////////////////////

  // DEV ONLY
  getAll: function(){
    return _routingTable;
  },

  // Get actions for resource
  getActions: function(resId){

    // XXX
    //console.log('GET_ACTIONS:', _routingTable);

    return Object.keys(_routingTable[resId]);
  },

  // Get resource end handler
  getEnd: function(resId, action){
    var path = [resId, action, 'end'].join('.');
    return _.get(_routingTable, path);
  },

  // Get resource middleware
  getMid: function(resId, action){
    var path = [resId, action, 'mid'].join('.');
    return _.get(_routingTable, path, []).reverse();
  },


  // Registors ////////////////////////////////////////////

  // Register stack end handler
  regEnd: function(resId, handler){

    // Iterate actions in handler
    _.forEach(handler, function(gen, action){
      var path = [resId, action, 'end'].join('.');
      _.set(_routingTable, path, gen);
    });

  },

  // Register middleware
  regMid: function(resId, middleware){

    // XXX
    //console.log('>>> Register mid for res', resId, middleware);

    // Iterate actions in middleware
    _.forEach(middleware, function(gen, action){

      var path = [resId, action, 'mid'].join(('.'));
      var mdlw = _.get(_routingTable, path, []);

      mdlw.push(gen);

      _.set(_routingTable, path, mdlw);
    });
  }
};



