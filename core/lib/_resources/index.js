
var _             = require('lodash');
var co            = require('co');
//var auth          = require('../auth');
var path          = require('path');
var router        = require('./router');
var express       = require('express');
var Promise       = require('bluebird');
var context       = require('./context');
var callerId      = require('caller-id');
var composer      = require('./composer');
var requireAll    = require('require-all');
var validators    = requireAll(path.resolve(__dirname, './validation'));
var parse         = requireAll(path.resolve(__dirname, './parsers'));
var dataProviders = require('./data/providers');

// Privates ///////////////////////////////////////////////////////////////////

// Get handlers stack
var getStack = function(resId, service, action){

  // Get components
  var validation = validators.interfaces[action](resId, service);
  var provider   = router.getProvider(resId, action);
  var middleware = router.getMiddleware(resId, action);
  var data       = router.getData(resId, action);

  // Build stack
  return _.compact(_.flatten([validation, middleware, provider, data]));
};


// Build S-Object interface options
var resInterfaces = function(resId, service){

  // Setup
  var actions = router.getActions(resId, service);

  // Build resource action interfaces
  return actions.reduce(function(interfaces, action){

    // Build the handlers stack
    var stack = getStack(resId, service, action);

    // Build the runner
    var runner = composer(stack);

    // Prepare the standard context
    var standardCtx = {
      resource: resId,
      action:   action,
      valid:    true
    };

    // Interface function
    var iface = function(params, externalCtx){

      // TODO: Activate after dev
      // Get caller data
      //var callerData = callerId.getData();
      //
      //// Validate usage
      //if( !auth.canUseResource(resId, callerData) )
      //  return Promise.reject('Undeclared use of resource ' + resId);

      // Build context
      var ctx = context.build(params, standardCtx, externalCtx);

      // Run!
      return runner.call(ctx).then(parse.response);

    };

    // Create protected action interface
    Object.defineProperty(interfaces, action, {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        iface
    });

    // Return interfaces
    return interfaces;

  }, {});
};


// Publics ////////////////////////////////////////////////////////////////////
module.exports = {

  // Register service resources
  register: function(service){

    // Any middleware to register?
    if(service.resources.middleware)
      _.forEach(service.resources.middleware, router.regMiddleware);


    // Any providers to register?
    if(service.resources.provides){
      service.resources.provides.forEach(function(resource){

        // Verify its a preferred resource
        if( !resource.preferred ) return;

        // Logging
        S.log('debug', 'Registering resource ' + resource.id);

        // Register handlers in router
        _.forEach(resource.handlers, function(fn, action){
            router.regProvider(resource.id, action, fn);
          });

        // Register data providers
        router.regDataProvider(resource, service);

        // Register in S-Object
        Object.defineProperty(S, resource.id, {
          configurable: false,
          enumerable:   true,
          writable:     false,
          value:        resInterfaces(resource.id, service)
        });
      });
    }
  },

  // HTTP request router
  httpRouter: function(){

    // Error handler
    var errHandler = function(req, res, err){

      // DEV deactivated
      //res.header("Content-Type", "application/vnd.api+json");
      res.status(err.status).json(parse.protocol.error(req, err));

    };

    // Request handler factory
    var reqHandler = function(endpoint){

      return function(req, res){

        try{
          // Request validation
          validators.http[endpoint](req);

          // Protocol validation
          validators.protocol[endpoint][req.method](req);

          // Parse request
          var parsed = parse.protocol[endpoint](req);

          // Get resource interface
          var resInterface = S[parsed.context.request.resource][parsed.context.request.action];

          // Delegate to resource interface
          resInterface.call(parsed.context, parsed.params).then(function(response){

            // Send response
            // DEV deactivated
            //res.header("Content-Type", "application/vnd.api+json");
            res.status(response.status).json(parse.response(response.data));

          }).catch(errHandler.bind(null, req, res));

        }catch(err){
          errHandler(req, res, err);
        }

      };

    };


    // Get express router
    var router = express.Router();

    // COLLECTION api endpoint
    router.all('/:resource', reqHandler('collection'));

    // SINGLE entry api endpoint
    router.all('/:resource/:id', reqHandler('single'));

    // RELATED entry api endpoint
    router.all('/:resource/:id/:related', reqHandler('related'));

    // RELATION api endpoint
    router.all('/:resource/:id/relationship/:related', reqHandler('relation'));

    return router;
  }

};