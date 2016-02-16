
//var EventEmitter = require('eventemitter2');
var requireAll   = require('require-all');
var Sequelize    = require('sequelize');
var callerId     = require('caller-id');
var Promise      = require('bluebird');
var express      = require('express');
var async        = require('async');
var path         = require('path');
var co           = require('co');
var _            = require('lodash');
var logger       = require('./lib/util/logger');
var dbUtil       = require('./lib/util/database');
//var srvUtil      = require('./lib/util/service');



// Privates ///////////////////////////////////////////////////////////////////

// Started flag
var S_started = false;

// Database config
var S_dbConfig = null;

// Smallcloud installation path
var S_path = path.resolve(__dirname, '../');

// Protected core store
var S_store = {
  app:      express(),
  database: null,
  models:   {},
  services: {},
  config:   {},
  policies: {}
};


// Validate method usage
var isValid = function(caller, member){

  // Is main script calling init?
  if( 'init' === member && S_path + '/smallcloud.js' === caller.filePath )
    return true;

  // Is call coming from core?
  var fromCore = (-1 !== caller.filePath.search(S_path + '/core'));

  // Is call coming from testing?
  var fromTests = (-1 !== caller.filePath.search(S_path + '/test'));

  return ( fromCore || fromTests );

};

// Process configurations
var processConfig = function(config){

  // Get file based configs
  var _config = requireAll(path.resolve(__dirname, '../config'));

  // Create db config
  S_dbConfig = _.assign({}, _config.database, config.database);

  // Set all config except for db config
  S.set('config', _.assign(_.omit(_config, 'database'), _.omit(config, 'database') || {}));

};


// Publics ////////////////////////////////////////////////////////////////////

// Create global core object
module.exports = GLOBAL.S = {

  // Logger
  log: function(level, message){
    if( !S.get('config.core.silent') )
      logger(level, message);
  },

  // Orm types facade
  // ORM might store db pwd, so never expose directly
  orm: {types: dbUtil.types},

  // Resource policies
  policies: S_store.policies.groups

};

// Create service object interface
//Object.defineProperty(S, 'service', {
//  configurable: false,
//  enumerable:   true,
//  get: function(){
//
//    // Get caller data
//    var caller = callerId.getData();
//
//    // Return the service
//    return srvUtil.srvFromPath(caller.filePath);
//  },
//  set: function(){ /* noop */ }
//});


// Protecteds /////////////////////////////////////////////////////////////////

var S_protected = {

  // Protected property setter
  set: function(path, component){

    // TODO: auth?

    // Set the component
    _.set(S_store, path, component);

    // Return the component
    return component;
  },

  // Protected property getter
  get: function(path){

    // TODO: auth?

    // Return requested object || undefined
    return _.get(S_store, path, undefined);
  },

  // Core init
  init: co.wrap(function *(config){

    // Only startup once
    if(S_started)
      throw new Error('SmallCloud init() can only be run once!');
    else
      S_started = true;

    // Setup
    var initTasks     = requireAll(path.resolve(__dirname, './init'));
    var initRunner    = Promise.promisify(async.auto);
    var httpListener  = Promise.promisify(S_store.app.listen);


    // Process configs
    processConfig(config);

    // Verbose
    console.log('  ');
    S.log('info', 'Starting SmallCloud...');

    // Start the database
    S_store.database = new Sequelize(
      S_dbConfig.name,
      S_dbConfig.username,
      S_dbConfig.password,
      S_dbConfig.options
    );

    // Run init tasks
    yield initRunner(initTasks);

    // Standard Express app HTTP listener
    //S_store.server = yield httpListener(S.get('config.http.port'));
    S_store.server = S_store.app.listen(S.get('config.http.port'), function(){

      // Log init completion
      S.log('info', 'Started HTTP server on ' + S.get('config.http.host') + ':' + S.get('config.http.port'));

      // Prevent instant shutdown
      process.stdin.resume();

      // Handle app exit event
      process.on('exit', shutdown.bind(null, {cleanup: true}));

      // Handle ctrl+C event
      process.on('SIGINT', shutdown.bind(null, {exit: true}));

      // Catch uncaught exceptions
      process.on('uncaughtException', shutdown.bind(null, {exit: true}));
    });


    // Shutdown procedure
    var shutdown = function(options, err){

      // Close database connection
      // TODO: make sure closes conn to db
      S.get('database').close();

      // Alternative?
      // this.sequelize.connectorManager.disconnect();

      if(options.cleanup){
        console.log('  ');
        S.log('info', 'Shutting down...\n');
      }
      if(err) console.log(err.stack);
      if(options.exit) process.exit();
    };

  })

};


// Attach protecteds to S-Object
_.forEach(S_protected, function(fn, key){

  if( S.hasOwnProperty(key) )
    return;

  Object.defineProperty(S, key, {
    configurable: false,
    enumerable:   false,
    writable:     false,
    value: function(){

      // Get caller data
      var caller = callerId.getData();

      // Validate caller
      if( isValid(caller, key) )
        return fn.apply(S, arguments);
      else
        throw new Error('Illegal invocation of S.' + key + ' from ' + caller.filePath);

    }
  });

});




