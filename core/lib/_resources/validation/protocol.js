
var _     = require('lodash');
var error = require('./errors');

var val = module.exports = {

  data: {

    hasDataMember: function(req){
      if( !('data' in req.body) || !_.isPlainObject(req.body) )
        error.unprocesableEntity({
          detail: 'Body must contain a plain object as a data member',
          source: {pointer: ''}
        });
    },

    hasTypeValid: function(req, pointer){
      var data = req.body.data;
      if( !('type' in data) || !_.isString(data.type) || req.params.resource !== data.type )
        error.unprocesableEntity({
          detail: 'Type member must be provided inside of data member',
          source: {pointer: pointer || '/data/type'}
        });
    },

    hasId: function(req){
      if( !('id' in req.body.data) )
        error.unprocesableEntity({
          detail: 'Id member must be provided inside of data member',
          source: {pointer: '/data/id'}
        });
    },

    hasNoId: function(req){
      if( 'id' in req.body.data )
        error.unprocesableEntity({
          detail: 'Providing ID is not supported',
          source: {pointer: '/data/id'}
        });
    },

    hasAttributes: function(req){
      if( !('attributes' in req.body.data) || !_.isPlainObject(req.body.data) )
        error.unprocesableEntity({
          detail: 'Body must contain a plain object as an attributes member',
          source: {pointer: '/data/attributes'}
        });
    },

    attsDefined: function(req){

      // Get model definition
      var definition = S.get('models.definitions.' + req.params.resource);

      // Get defined attributes
      var definedAtts = Object.keys(definition.atts);

      // Get request attributes
      var reqAtts = Object.keys(req.body.data.attributes);

      // Obtain not defined attributes
      var diff = _.difference(reqAtts, definedAtts);

      // Compare
      if( 0 < diff.length )
        error.unprocesableEntity({
          detail: 'Attributes ' + diff.join(', ') + ' are not defined in model',
          source: {pointer: '/data/attributes'}
        });
    },

    relsDefined: function(req){

      // Get model definition
      var definition = S.get('models.definitions.' + req.params.resource);

      // Get defined relations
      var definedRels = definition.relations.map(function(rel){
          return rel.model;
        });

      // Get request relationships
      var requestRels = Object.keys(req.body.data.relationships);

      // Obtain not existing relationships
      var diff = _.difference(requestRels, definedRels);

      // Compare
      if( 0 < diff.length )
        error.unprocesableEntity({
          detail: 'Relationship/s ' + diff.join(', ') + ' is/are not defined in model',
          source: {pointer: '/data/relationships'}
        });
    },

    relData: function(req){

      _.forEach(req.body.data.relationships, function(obj, relName){

        // Dummy req object
        var dummy = {
          body: {data: obj},
          params: {resource: relName}
        };

        // Validate
        val.data.hasTypeValid(dummy, '/data/relationships/'+relName+'/data/type');
        val.data.hasId(dummy);
      });
    }

  },

  // Endpoints ////////////////////////////////////////////

  collection: {
    GET: function(req){},
    POST: function(req){

      val.data.hasDataMember(req);
      val.data.hasNoId(req);
      val.data.hasAttributes(req);
      val.data.attsDefined(req);

      // Request has relationships?
      if( !req.body.data.relationships ) return;

      val.data.relsDefined(req);
      val.data.relData(req);

    }
  },

  single: {
    GET: function(req){},
    POST: function(req){},
    UPDATE: function(req){},
    DELETE: function(req){}
  },

  related: {
    GET: function(req){},
    //POST: function(req){},
    //UPDATE: function(req){},
    //DELETE: function(req){}
  },

  relation: {
    GET: function(req){},
    POST: function(req){},
    UPDATE: function(req){},
    DELETE: function(req){}
  }

};
