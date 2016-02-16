
var _        = require('lodash');
var fs       = require('fs');
var path     = require('path');
var semver   = require('semver');
var Resource = require('../lib/resources/resource');
var langUtil = require('../lib/util/lang');
var DepGraph = require('dependency-graph').DepGraph;


// Validate resource
var isValid = function(res){

  // Have provider or model?
  if( !('provider' in res) && !('model' in res) )
    return false;

  // Has defined a vocabulary?
  if( !('schema' in res) )
    return false;

  // All good
  return true;
};

// Load resources
var load = function(){

  // Resource paths
  var extrPath = this.resPath;
  var corePath = path.resolve(__dirname, '../resources');

  // Build candidates list
  var candidates = _.flatten([
    fs.readdirSync(this.resPath).map(function(cand){ return [extrPath, cand].join('/') }),
    fs.readdirSync(corePath).map(function(cand){ return [corePath, cand].join('/') })
  ]);

  // Iterate candidates
  candidates.forEach(function(candidate){

    var manifestPath = [candidate, 'manifest.json'].join('/');

    try{

      // Get manifest
      var manifest = _.assign(require(manifestPath), {
        id:   _.last(candidate.split('/')),
        path: candidate
      });

      // Build the resource
      var resource = Resource(manifest);

      // Is the resource valid
      if( !isValid(resource) ){
        S.log('warn', candidate + ' is not a valid resource');
        return;
      }

      // Store resource
      this.resources.push(manifest);

      // Add to dependency graph
      this.depGraph.addNode(manifest.id);

    }catch(err){
      if( 'MODULE_NOT_FOUND' === err.code )
        S.log('warn', candidate + ' is not a valid resource');
      else
        console.error(err.message, err.stack);
    }

  }, this);

};

// Assess uninstalled and dependencies
var assess = function(){

  // Set aside uninstalled resources
  this.known.forEach(function(knownRes){

    // Resource is installed?
    if( _.find(this.resources, {id: knownRes.id}) )
      return;

    // Extract uninstalled resource
    var rem = _.remove(this.known, {id: knownRes.id});

    // Store for removal
    this.uninstalled.push(rem);

  }, this);

  // Process installed resources
  this.resources.forEach(function(res){

    // Resource has dependencies?
    if( !('dependencies' in res) || _.isEmpty(res.dependencies) ){
      res.activable = true;
      return;
    }

    // Iterate dependencies
    _.forEach(res.dependencies, function(depVersion, depId){

      // Get required resource manifest
      var depManifest  = _.find(this.resources, {id: depId});

      // Is required resource installed?
      if( depManifest ){

        if( depManifest && semver.satisfies(depVersion, depManifest.version) ){
          res.activable = true;
          this.depGraph.addDependency(res.id, depManifest.id);
        }else{
          res.activable = false;
        }

      }else{
        res.activable = false;
      }

    }, this);

  }, this);

  // XXX
  //console.log('ASSESS:', this.resources);

};

// Startup resources
var startup = function *(){

  // Setup resources
  var ready = _.reduce(this.depGraph.overallOrder(), function(out, resId){

    // Get resource
    var resource = _.find(this.resources, {id: resId});

    // Is it activable?
    if( !resource.activable /* || !resource.active */)
      return out;

    // Setup resource
    resource.setup();

    // Add to output
    out.push(resource);

    // Done
    return out;

  }, [], this);

  // Register resource facades
  yield ready.map(function(res){
    return res.activate();
  });

};

// Persist resource status to db
var persist = function(){

  // Delete uninstalled resources
  var removedP = this.uninstalled.map(function(res){
    return res.destroy();
  });

  // Properties to omit
  var omit = ['hooks', 'activate', 'model', 'provider'];

  // Save new resources
  var addedP = this.resources.map(function(res){
    return S.get('database').models.resources.findOrCreate({
      where:    {id: res.id},
      defaults: _.omit(res, omit)
    });
  });

  // Return promises
  return [
    removedP,
    addedP
  ];

};



module.exports = ['database', function(callback){

  // Setup
  var schema = require('../models/resources');
  var path   = S.get('config.resources.path');


  langUtil.genCallback(function *(){

    // Register and migrate resources model
    var resources = yield S.get('database').define('resources', schema.atts).sync();

    // Setup context
    var context = {
      resPath:     path,
      known:       yield resources.findAll(),
      depGraph:    new DepGraph(),
      resources:   [],
      candidates:  fs.readdirSync(path),
      uninstalled: []
    };

    // Load resources into context
    load.call(context);

    // Assess resources
    assess.call(context);

    // Startup resources
    yield startup.call(context);

    // Persist resources status
    yield persist.call(context);

  }, callback);

}];