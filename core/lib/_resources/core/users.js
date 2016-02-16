
var parseResponse = require('../parsers/response');

module.exports = {
  id: 'users',
  desc: 'SmallCloud system users',
  handlers: {
    fetch:  function *(next){ yield next; },

    create: function *(next){

      // Extract password
      var password = this.request.data.password;
      delete this.request.data.password;

      yield next;

      // Has a user been created?
      if( this.response.created ){
        // Set the password
        yield this.response.data.update({password: password});
      }

      // Make data plain so encrypted pwd can be removed
      parseResponse(this.response);

      // Remove password from response
      delete this.response.data.password;
    },
    update: function *(next){ yield next; },

    remove: function *(next){ yield next; }
  }
};