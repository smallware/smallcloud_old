
var _ = require('lodash');

module.exports = {

  // Build resource request context
  build: function(params, standardCtx, externalCtx){

    // XXX
    //console.log('>>> PARAMS', params);

    // Response
    var response = {};

    // Request
    var request = _.assign(externalCtx || {}, standardCtx);

    // XXX
    //console.log('\n>>>', request);

    // Have params?
    if(params)
      request.params = params;


    // Compose the context object && return
    return {
      request:  request,
      response: response
    };
  }
};