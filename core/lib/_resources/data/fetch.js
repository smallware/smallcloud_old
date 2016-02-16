
var _     = require('lodash');
var error = require('../validation/errors');

// Setup
var queryParams = ['where', 'attributes', 'order', 'limit', 'offset'];


var parseParams = function(params){

  // No params?
  if( !params )
    return {};

  // Simple ID or array of IDs
  if( _.isString(params) || _.isNumber(params) || _.isArray(params) ){

    // XXX
    //console.log('--- Simple ID query');

    return {where: {id: params}};
  }

  // XXX
  //console.log('---', Object.keys(params.query));
  //console.log('---', queryParams);
  //console.log('---', _.intersection(Object.keys(params.query), queryParams).length);

  var paramsInQuery = Object.keys(params.query);
  var intersection = _.intersection(paramsInQuery, queryParams)

  // Is this a simple field query?
  if( 'query' in params && 0 === intersection.length ){

    // XXX
    //console.log('--- Simple field query');

    return {where: params.query};
  }

  // XXX
  //console.log('--- Complex query');

  // Is this a complex query
  return params.query;

};


var fetch = module.exports = {

  simple: function *(request){

    // XXX
    //console.log('>>> params', request.params);

    // Setup
    var response = {};
    var model    = S.get('database').model(request.resource);
    var options  = parseParams(request.params);

    // XXX
    //console.log('<<< OPTIONS', options);

    // Query
    response.data = yield model.findAll(options);

    // Validate
    if( _.isEmpty(response.data) )
      error.notFound('There are no entries for ' + request.resource);

    // Single result?
    if( 1 === response.data.length )
      response.data = response.data[0];

    // Set status
    response.status = 200;

    // Return response
    return response;
  },

  related: function *(request){

    // Setup
    var response = {};
    var model    = S.get('database').model(request.resource);
    var options  = request.filter(function(key){
      return !_.includes(notOptions, key);
    });

    // Query
    // TODO: Adapt query
    response.data = yield model.findAll(options);

    // Validate
    if( _.isEmpty(response.data) )
      error.notFound('There are no entries for ' + request.resource);

    // Set status
    response.status = 200;

    // Return response
    return response;

  }

  //all: function *(request){
  //
  //  // XXX
  //  //console.log('>>> fetch.all');
  //
  //  // Setup
  //  var response = {};
  //
  //  // Query
  //  response.data = yield request.model.findAll();
  //
  //  // Validate
  //  if( _.isEmpty(response.data) )
  //    error.notFound('There are no entries for ' + request.resource);
  //
  //  // Set status
  //  response.status = 200;
  //
  //  // Return response
  //  return response;
  //},
  //
  //byId: function *(request){
  //
  //  // XXX
  //  //console.log('>>> fetch.byId', request.query.id);
  //
  //  var response = {};
  //
  //  response.data = yield request.model.findById(request.query.id);
  //
  //  if( _.isEmpty(response.data) )
  //    error.notFound('There is no resource ' + request.resource + ' with id = ' + request.query.id);
  //
  //  response.status = 200;
  //
  //  return response;
  //},
  //
  //query: function *(request){
  //
  //  // XXX
  //  //console.log('>>> fetch.query', request.query);
  //
  //  // Setup
  //  var response = {};
  //  var options  = {};
  //  var query    = _.cloneDeep(request.query);
  //
  //  // Parse
  //  if( 'attributes' in query ){
  //    _.assign(options, query.attributes);
  //    delete query.attributes;
  //  }
  //
  //
  //  // Query
  //  response.data = yield request.model.findAll({where: request.query});
  //
  //  // Validate
  //  if( _.isEmpty(response.data) ){}
  //    error.notFound(request.resource + ' entry could not be found');
  //
  //  // Set status
  //  response.status = 200;
  //
  //  // Return response
  //  return response;
  //}

};