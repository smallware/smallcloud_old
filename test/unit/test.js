
var _          = require('lodash');
var path       = require('path');
var coMocha    = require('co-mocha');
var requireAll = require('require-all');
var tests      = requireAll(path.resolve(__dirname, './tests'));


// Load configuration
//var config = requireAll(path.resolve(__dirname, './mocks/config'));

// Runner
function runner(tests){
  _.forEach(tests, function(test){
    if( _.isFunction(test) )
      test();
    else
      runner(test);
  });
}


describe('SmallCloud unit tests', function(){

  // Run tests!
  runner(tests);

});

