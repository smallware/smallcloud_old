
module.exports = function(resource){

  return function *(){

    // XXX
    console.log('>>> Running create data end', this);

    // Result parser
    var parser = function(instance, created){
      this.response.instance = instance;
      this.response.created  = created;
    };

    // Create the resource
    yield S.get('database').models[this.request.resource].findOrCreate({
      where: this.request.params,
      defaults: this.request.params
    }).spread(parser.bind(this));

  };

};