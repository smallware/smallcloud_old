
var _     = require('lodash');
var error = require('./errors');

var val = module.exports = {

  resourceExists: function(req){
    if( !(req.params.resource in S) )
      error.notFound('Resource ' + req.params.resource + ' was not found');
  },

  methodNotGet: function(req){
    if( 'GET' === req.method )
      error.badRequest('This endpoint does not support GET requests');
  },

  methodNotPost: function(req){
    if( 'POST' === req.method )
      error.badRequest('This endpoint does not support POST requests');
  },

  methodNotPatch: function(req){
    if( 'PATCH' === req.method )
      error.badRequest('This endpoint does not support PATCH requests');
  },

  methodNotDelete: function(req){
    if( 'DELETE' === req.method )
      error.badRequest('This endpoint does not support DELETE requests');
  },

  protocol: function(req){
    if('application/vnd.api+json' !== req.headers.accept)
      error.notAcceptable('Only application/vnd.api+json content type is allowed')
  },


  // Endpoints ////////////////////////////////////////////

  collection: function(req){

    val.protocol(req);
    val.resourceExists(req);
    val.methodNotPatch(req);
    val.methodNotDelete(req);

  },

  single: function(req){

    val.protocol(req);
    val.resourceExists(req);
    val.methodNotPost(req);

  },

  related: function(req){

    val.protocol(req);
    val.resourceExists(req);

  },

  relation: function(req){

    val.protocol(req);
    val.resourceExists(req);

  }

};