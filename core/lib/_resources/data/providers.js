
var _      = require('lodash');
var co     = require('co');
var error  = require('../validation/errors');
var fetch  = require('./fetch');
var create;
var update;
var remove;

// TODO: Contemplate relation requests
// TODO: Parse query in each provider
// TODO: Catch and transform sequelize errors

var ormError = function(err){
  error.internalServerError(err.errors);
};

module.exports = {

  fetch: function *(){

    // XXX
    //console.log('>>> PROVIDERS:', this.request.params);

    // Parse params
    if( _.isEmpty(this.request.params) ){

      this.response = yield fetch.simple(this.request);

    }else{

      if( _.isPlainObject(this.request.params) && 'from' in this.request.params )
        this.response = yield fetch.related(this.request);
      else
        this.response = yield fetch.simple(this.request);
    }
  },

  create: function *(){

    // XXX
    //console.log('>>> THIS', this);

    var model = S.get('database').model(this.request.resource);

    var response = yield model.findOrCreate({
      where:    this.request.params.data,
      defaults: this.request.params.data
    }).catch(function(err){
      console.log('=== ERROR ===');
      console.error(err);
    });

    this.response.data    = response[0];
    this.response.created = response[1];
  },

  update: function *(){

    // XXX
    //console.log('@@@ Running UPDATE data provider');

    var entry = yield this.request.model.findAll({where: this.request.query});

    this.response.data = yield entry.update(this.request.data);
  },

  remove: function *(){

    // XXX
    //console.log('@@@ Running REMOVE data provider');

    var entry = yield this.request.model.findOne({where: this.request.query});

    this.response.count = yield entry.destroy();
  }
};