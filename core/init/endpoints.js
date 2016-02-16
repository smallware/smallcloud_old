
var path       = require('path');
var express    = require('express');
var requireAll = require('require-all');
var validators = requireAll(path.resolve(__dirname, '../lib/resources/validators'));


var resources = {

  // Register endpoints
  endpoints: function(){

    // Get express router
    var router = express.Router();

    // COLLECTION api endpoint
    router.all('/:resource', this.handler('collection'));

    // SINGLE entry api endpoint
    router.all('/:resource/:id', this.handler('single'));

    // RELATED entry api endpoint
    router.all('/:resource/:id/:related', this.handler('related'));

    // RELATION api endpoint
    router.all('/:resource/:id/relationship/:related', this.handler('relation'));

    // Done
    return router;
  },

  // Vocabulary schemas
  schemas: function(){

    // Get express router
    var router = express.Router();

    // Handler
    router.get('/:resource', function(req, res){

      // TODO: Validate resource ID

      // Get schema
      var schema = S[req.params.resource].schema;

      // Respond
      res.json(schema);

    });

    // Done
    return router;
  },

  // Error handler
  error: function(req, res, err){

    // DEV deactivated
    //res.header("Content-Type", "application/vnd.api+json");
    res.status(err.status).json(parse.protocol.error(req, err));

  },

  // Handle resource requests
  handler: function(endpoint){

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

        }).catch(this.error.bind(null, req, res));

      }catch(err){
        this.error(req, res, err);
      }

    };
  }
};

module.exports = ['resources', function(callback){

  // Register resource endpoints
  S.get('app').use( '/api', resources.endpoints() );

  // Register resource vocabularies
  S.get('app').use( '/schema', resources.schemas() );

  // Done
  callback();

}];