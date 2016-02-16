
var _          = require('lodash');
var co         = require('co');
var path       = require('path');
var data       = require('./data');
var router     = require('./router');
var Promise    = require('bluebird');
var requireAll = require('require-all');
var validators = requireAll(path.resolve(__dirname, './validators')).facades;


// Build helpers
var build = {

  // Build resource stack
  stack: function(resource, action){

    var val = validators[action](resource);
    var mid = router.getMid(resource.id, action);
    var end = router.getEnd(resource.id, action);

    // Build stack
    return _.compact(_.flatten([val, mid, end]));

  },

  // Build context
  context: function(commonCtx, params){

    // Response
    var response = {};

    // Request
    var request = _.assign(this || {}, commonCtx);

    // Have params?
    if(params)
      request.params = params;

    // Compose the context object && return
    return {
      request:  request,
      response: response
    };
  },

  // Build stack runner
  runner: function(stack){

    var noop = function *(){};

    // Return runner
    return co.wrap(function *(bottom){

      var i = stack.length;
      var prev = bottom || noop;
      var curr;

      while (i--) {
        curr = stack[i];
        prev = curr.call(this, prev);
      }

      yield *prev;

      return this.response;
    });

  },

  // Build interfaces
  interfaces: function(interfaces, action){

    // Get handlers stack
    var stack = build.stack(this, action);

    // Handlers runner
    var runner = build.runner(stack);

    // Build common context
    var commonCtx = {
      resource: this.id,
      action:   action,
      valid:    true
    };

    // Action interface
    var actionIface = function(params){

      // TODO: Execution validation

      // Inherited context
      var inherited = (_.isEqual(this, interfaces))? {} : this;

      // Build context
      var ctx = build.context.call(inherited, commonCtx, params);

      // Run!
      return runner.call(ctx);

    };

    // Create protected action interface
    Object.defineProperty(interfaces, action, {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        actionIface
    });

    // Return interfaces
    return interfaces;
  },

  // Build policy
  policy: function(){

    // Setup
    var polId = this.id + '_policy';

    // Register policy
    if( 'groups' !== this.id && !(polId in S.get('database').models) ){

      // Setup policy
      var policyModel    = require('../../models/policies');
      var resInstance    = S.get('database').models.resources;
      var groupInstance  = S.get('database').models.groups;
      var policyInstance = S.get('database').define(
        this.id + '_policy',
        policyModel.atts
      );

      // Register policy
      groupInstance.belongsToMany(resInstance, {through: policyInstance});
      resInstance.belongsToMany(groupInstance, {through: policyInstance});
    }

  },

  // Finalize resource activation
  final: function(){

    // Register in S
    S.set('resources.' + this.id, this);

    // Run the resource init hook?
    if( 'hooks' in this && 'startup' in this.hooks ){
      var startup = co.wrap(this.hooks.startup);
      return startup.call(this);
    }
  }

};


// Component loaders
var load = {

  // Load model
  model: function(){
    try{
      this.model = require(this.path + '/model');
    }catch(err){
      if( 'MODULE_NOT_FOUND' === err.code )
        S.log('trace', this.id + ' has no model');
      else
        console.error(err.message, err.stack);
    }
  },

  // Load provider
  provider: function(){
    try{
      this.provider = requireAll(this.path + '/provider');
    }catch(err){
      if( 'ENOENT' === err.code )
        S.log('trace', this.id + ' has no provider');
      else
        console.error(err.message, err.stack);
    }
  },

  // Load hooks
  hooks: function(){
    try{
      this.hooks = require(this.path + '/hooks');
    }catch(err){
      if( 'MODULE_NOT_FOUND' === err.code )
        S.log('trace', this.id + ' has no hooks');
      else
        console.error(err.message, err.stack);
    }
  },

  // Load middleware
  middleware: function(){
    try{
      this.middleware = requireAll(this.path + '/middleware');
    }catch(err){
      if( 'ENOENT' === err.code )
        S.log('trace', this.id + ' has no middleware');
      else
        console.error(err.message, err.stack);
    }
  }
};


// Base resource
var _resource = {

  // Setup the resource
  setup: function(){

    // Has a model?
    if( 'model' in this ){

      // Create model instance
      this.instance = S.get('database').define(
        this.id,
        this.model.atts,
        this.model.options || {}
      );

      // Register data provider
      router.regEnd( this.id, data(this) );
    }

    // Resource has provider?
    if( 'provider' in this )
      router.regMid( this.id, this.provider );

    // Resource has middleware?
    if( 'middleware' in this ){
      _.forEach(this.middleware, function(mid, resId){
        router.regMid( resId, mid );
      });
    }

    // Resource has middleware hooks?
    var actions = ['fetch', 'create', 'update', 'remove'];
    if( 0 < _.intersection(actions, Object.keys(this.hooks)).length ){

      // Build
      var middleware = _.reduce(this.hooks, function(out, hook, action){

        // Hook is an action?
        if( !_.includes(actions, action) )
          return out;

        // TODO: Validate hook is generator

        // Add hook
        out[action] = hook;

        // Done
        return out;

      }, {}, this);

      // Register hooks middleware
      router.regMid(this.id, middleware);
    }
  },

  // Activate resource facade
  activate: function *(){

    // Log startup
    S.log('debug', 'Starting resource ' + this.id);

    // Model has relations?
    if( 'relations' in this.model ){

      // Try to load relation
      try{
        this.model.relations.forEach(function(rel){
          var relModel = S.get('database').models[rel.model];
          this.instance[rel.type](relModel, rel.options);
        }, this);
      }catch(err){
        S.log('error', 'Failed to load relations for resource model ' + this.id);
        console.error(err);
      }
    }

    // Get actions associated to resource
    var actions = router.getActions(this.id);

    // Build resource action interfaces
    var interfaces = actions.reduce(build.interfaces.bind(this), {});

    // Add schema interface
    Object.defineProperty(interfaces, 'schema', {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        this.schema
    });

    // Register in S-Object
    Object.defineProperty(S, this.id, {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        interfaces
    });

    // Setup policy
    build.policy.call(this);

    // Migrate and finalize
    return S.get('database').sync().then(build.final.bind(this));
  }

};


module.exports = function Resource(manifest){

  // Create resource object
  var resource = _.assign(manifest, _resource);

  // Get resource model
  load.model.call(resource);

  // Get resource provider
  load.provider.call(resource);

  // Get resource hooks
  load.hooks.call(resource);

  // Get resource middleware
  load.middleware.call(resource);

  // Return proxy
  return resource;
};