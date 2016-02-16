
var _  = require('lodash');
var co = require('co');

module.exports = {

  // Generator to callback
  genCallback: function(gen, callback){

    co(gen)
      .then(function(result){ callback(null, result); })
      .catch(callback);
  }
};