
var eventemitter = require('eventemitter2');
var session      = require('express-session');
var co           = require('co');
var _            = require('lodash');

// Build the base object
var sessionStore = module.exports = Object.create(session.Store.prototype);

// Sessions and users map
var userSessions = {};

// Get models
var sessionModel = S.get('models.instances.sessions');
var userModel    = S.get('models.instances.users');

// Set max session age && expiration watch interval
var maxAge = 24 * 60 * 60 * 1000;             // 1 day
var expirationWatchInterval = 15 * 60 * 1000; // 15 minutes

// Start session expiration watch
var watchInterval = setInterval(function(){

  sessionModel.findAll({
    where: {
      expires: {lt: new Date()}
    }
  }).then(function(sessions){

    sessions.forEach(function(session){
      session.destroy();
      delete userSessions[session.sid];
    });

  });

}, expirationWatchInterval);


// Store public methods ///////////////////////////////////////////////////////

// Get a session from the store
sessionStore.get = function(sid, callback){

  sessionModel.findById(sid).then(function(session){

    // TODO: Validate session expiration

    if(!session) return callback();
    callback(null, session.data);

  }).catch(callback);
};

// Get user form sid
sessionStore.getUserId = function(sid){
  return userSessions[sid];
};

// Register a session into the store
sessionStore.set = function(sid, data, callback){

  // Set session expiration
  var expires = _.get(data, 'cookie._expires', null) || new Date(Date.now() + maxAge);

  // Get session user
  var user = _.get(data, 'passport.user', null) || null;

  // Build session data
  var sessionData = {
    data:    data,
    expires: expires
  };

  // Run the queries
  co(function *(){

    // Find or create the session
    var response = yield sessionModel.findOrCreate({
        where: {sid: sid},
        defaults: sessionData
      }).then(function(_response){
        return {
          session: _response[0],
          created: _response[1]
        };
      });

    // Add user session to db?
    if( user ){
      yield userModel.findById(user).then(function(_user){
        _user.addSession(response.session);
      });
    }

    // Add session to map
    userSessions[sid] = user || null;

    // Was the session updated?
    if( _.isEqual(response.session.data, data) )
      return;

    // Update session data
    userSessions[sid]     = user;
    response.session.data = _.assign(response.session.data, data);
    yield response.session.save();

    // Done
    return data;

  }).then(function(sessionData){
    callback(null, sessionData);
  }).catch(callback);

};

// Signal to the store the given session is active
sessionStore.touch = function(sid, data, callback){

  // Set session expiration
  var expires = _.get(data, 'cookie._expires', null) || new Date(Date.now() + maxAge);

  // Update session
  sessionModel.update({expires: expires}, {where: {sid: sid}})
    .then(function(){ callback(null); })
    .catch(callback);

};

// Delete a session from the store
sessionStore.destroy = function(sid, callback){

  co(function *(){

    // Remove from map
    delete userSessions[sid];

    // Get to be deleted session
    var session = yield sessionModel.findById(sid);

    // Session exists?
    if(!session)
      return;

    // Destroy the session
    yield session.destroy();

  }).then(function(){ callback(null); })
    .catch(callback);
};

// Count of all sessions in the store
sessionStore.length = function(callback){

  sessionModel.count().then(function(count){
    callback(null, count);
  }).catch(callback);

};