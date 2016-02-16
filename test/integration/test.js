
var _          = require('lodash');
var path       = require('path');
var coMocha    = require('co-mocha');
var smallcloud = require('../../core');
var requireAll = require('require-all');
var tests      = requireAll(path.resolve(__dirname, './tests'));


// Runner
function runner(tests){
  _.forEach(tests, function(test){
    if( _.isFunction(test) )
      test();
    else
      runner(test);
  });
}


describe('SmallCloud integration tests', function(){

  before(function *(){
    yield S.init({
      core: {
        silent: true,
        port:   6666
      },
      services: {
        root:     path.resolve(__dirname, './mocks/services'),
        manifest: 'manifest.json'
      },
      database: {
        // Only for dev testing
        password: 'smalldev'
      }
    }).catch(function(err){
      console.error(err);
    });
  });

  // Run tests!
  runner(tests);

});