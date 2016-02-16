
var _     = require('lodash');
var error = require('../validation/errors');

var methodActionMap = {
  GET:    'fetch',
  POST:   'create',
  PATCH:  'update',
  DELETE: 'remove'
};

var buildContext = function(req){
  return {
    request: {
      resource:  req.params.resource,
      sessionId: req.sessionID,
      action:    methodActionMap[req.method]
    }
  };
};

module.exports = {

  collection: function(req){

    var params = {};

    return {
      context:  buildContext(req),
      params:   params
    };

  },

  single: function(req){

    var params;

    if( _.isEmpty(req.query) )
      params = req.params.id;
    else{

    }

    return {
      context:  buildContext(req),
      params:   params
    };

  },

  related: function(req){

    var params = {};

    return {
      context:  buildContext(req),
      params:   params
    };

  },

  relation: function(req){

    var params = {};

    return {
      context:  buildContext(req),
      params:   params
    };

  },

  response: function(response){
    // TODO
    return response;
  },

  error: function(req, err){

    // Self link
    var self = S.get('config.http.host') + ':' + S.get('config.http.port') + req.originalUrl;

    // Return error object
    return {
      jsonapi: { "version": "1.0" },
      links: {
        self: self
      },
      errors: [{
        status: err.status,
        title:  err.message,
        detail: err.detail
      }]
    };

  }

};