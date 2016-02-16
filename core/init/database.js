
var _          = require('lodash');
var path       = require('path');
var dbUtil     = require('../lib/util/database');
var langUtil   = require('../lib/util/lang');
var requireAll = require('require-all');

module.exports = function(callback){

  // Info
  //S.log('verbose', 'Connecting to database...');

  //langUtil.genCallback(function *(){
  //
  //  //// Load model definitions
  //  //var definitions = requireAll(path.resolve(__dirname, '../models'));
  //  //S.set('models.definitions', definitions);
  //  //
  //  //// Create model instances
  //  //var instances = dbUtil.createModels(_.omit(definitions, 'policies'));
  //  //S.set('models.instances', instances);
  //
  //
  //  //// Register user and sessions relationship
  //  //var users    = S.get('models.instances.users');
  //  //var sessions = S.get('models.instances.sessions');
  //  //users.hasMany(sessions);
  //  //
  //  //
  //  //// Instance policies
  //  //var policies = S.get('database').define('policies', S.get('models.definitions.policies').atts);
  //  //
  //  //// Get relation instances
  //  //var resources = S.get('models.instances.resources');
  //  //var groups    = S.get('models.instances.groups');
  //  //
  //  //// Register relations
  //  //resources.belongsToMany(groups, {through: policies});
  //  //groups.belongsToMany(resources, {through: policies});
  //  //
  //  //// Register policies instance
  //  //S.set('models.instances.policies', policies);
  //
  //
  //  // Migrate
  //  //yield S.get('database').sync({force: false});
  //
  //}, callback);

  // XXX
  callback();

};