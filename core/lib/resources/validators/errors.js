
var _           = require('lodash');
var createError = require('http-errors');

var thrower = function(status, mesg, opt){

  if( _.isString(opt) )
    throw createError(status, mesg, {detail: opt});
  else if( _.isPlainObject(opt) )
    throw createError(status, mesg, opt);
};

//const ERRORS = {
//  badRequest: {
//    title: 'Bad request',
//    status: 400
//  },
//  unauthorized: {
//    title: 'Unauthorized',
//    status: 401
//  },
//  forbidden: {
//    title: 'Forbidden',
//    status: 403
//  },
//  notFound: {
//    title: 'Not found',
//    status: 404
//  },
//  methodNotAllowed: {
//    title: 'Method not allowed',
//    status: 405
//  },
//  notAcceptable: {
//    title: 'Not acceptable',
//    status: 406
//  },
//  conflict: {
//    title: 'Conflict',
//    status: 409
//  },
//};

var errors = {

  badRequest: function(opt){
    thrower(400, 'Bad Request', opt);
  },
  unauthorized: function(opt){
    thrower(401, 'Unauthorized', opt);
  },
  forbidden: function(opt){
    thrower(403, 'Forbidden', opt);
  },
  notFound: function(opt){
    thrower(404, 'Not Found', opt);
  },
  methodNotAllowed: function(opt){
    thrower(405, 'Method Not Allowed', opt);
  },
  notAcceptable: function(opt){
    thrower(406, 'Not Acceptable', opt);
  },
  conflict: function(opt){
    thrower(409, 'Conflict', opt);
  },
  unprocesableEntity: function(opt){
    thrower(422, 'Unprocessable Entity', opt);
  },

  insternalServerError: function(opt){
    thrower(500, 'Internal Server Error', opt);
  }
};

module.exports = errors;