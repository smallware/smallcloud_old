
var fetch  = require('./fetch');
var create = require('./create');
var update = require('./update');
var remove = require('./remove');

module.exports = function(resource){

  // XXX
  //console.log('>>> Setting up model data end for resource', resource.id);

  return {
    fetch: fetch(resource),
    create: create(resource),
    update: update(resource),
    remove: remove(resource)
  };
};

