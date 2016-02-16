
var _     = require('lodash');
var error = require('./errors');

var validate = {

  queryNotEmpty: function(){
    if( _.isEmpty(this.query) ){
      this.valid = false;
      error.badRequest('Query cannot be empty');
    }
  },

  queryWithId: function(){
    if( !('id' in this.query) || _.isEmpty(this.query) ){
      this.valid = false;
      error.badRequest('Query must include a resource ID');
    }
  },




  dataEmpty: function(){

    if( !this.valid ) return;

    if( !_.isEmpty(this.params) && !_.isEmpty(this.params.data) ){
      this.valid = false;
      error.badRequest('Request must not contain data');
    }
  },

  relation: function(resource){

    if( !this.valid ) return;

    // Shorthands
    var resId     = this.resource;
    var params    = this.params || {};
    var relations = resource.model.relations || [];

    // Relationship query?
    if( !_.isPlainObject(params) || !('rel' in params) )
      return;

    // Validate relation declaration
    if( !('resource' in params.rel) || !('id' in params.rel) ){
      this.valid = false;
      error.badRequest('Malformed relationship query');
    }

    // Get valid relations
    var validRels = relations.map(function(def){
      return def.model;
    });

    // Validate relationship
    if( !_.includes(validRels, params.rel.resource) ){
      this.valid = false;
      error.badRequest('Resource ' + params.rel.resource + ' is not related to ' + resId);
    }

  }

};

module.exports = {
  fetch:  function(resource){
    return function *(next){

      // XXX
      //console.log('>>> VALIDATION', this.request.params);

      validate.relation.call(this.request, resource);
      validate.dataEmpty.call(this.request);

      if(this.request.valid)
        yield next;

    };
  },
  create: function(resource){
    return function *(next){

      if(this.request.valid)
        yield next;
    };
  },
  update: function(resource){
    return function *(next){

      validate.relation.call(this.request, resource);

      if(this.request.valid)
        yield next;
    };
  },
  remove: function(resource){
    return function *(next){

      if(this.request.valid)
        yield next;
    };
  }
};