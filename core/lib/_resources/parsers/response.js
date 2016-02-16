
var _ = require('lodash');

module.exports = function(response){

  // Parse response data
  parse.data(response);

  //// XXX
  //console.log('>>>>> RESPONSE:', response);

  // Return response for chaining
  return response;
};

var parse = {
  data: function(response){

    // Has data?
    if(_.isEmpty(response.data))
      return;

    // Is data array?
    if( _.isArray(response.data) && _.isFunction(response.data[0].get) ){
      response.data = response.data.map(function(item){
        return item.get({plain: true});
      });
    }

    // Must be single result
    if( _.isFunction(response.data.get) )
      response.data = response.data.get({plain: true});
  }
};