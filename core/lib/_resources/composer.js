
var _  = require('lodash');
var co = require('co');


var noop = function *(){};

// Runner composer
module.exports = function(stack){

  // Return runner
  return co.wrap(function *(bottom){
    var i = stack.length;
    var prev = bottom || noop;
    var curr;

    while (i--) {
      curr = stack[i];
      prev = curr.call(this, prev);
    }

    yield *prev;

    return this.response;
  });

};