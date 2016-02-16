
var smallcloud = require('./core');

// Prepare config
var config = {
  database: {
    // Get db pwd and remove from array
    password: process.argv.pop()
  }
};

// Startup!
smallcloud.init(config).then(function(result){

  // XXX
  console.log('\n\nFINAL:', result);

}).catch(function(err){

  // DEV
  console.log('\n\nFINAL CATCH:');
  console.error(err);
  console.error(err.stack);

  throw err;
});