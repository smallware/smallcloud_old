

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var helmet       = require('helmet');
var flash        = require('connect-flash');

//var sessionStore   = require('../lib/sessionStore');
//var SequelizeStore = require('connect-session-sequelize')(session.Store);
module.exports = function(cb){ cb() };
var xxx = ['database', function(callback){

  // Verbose log
  S.log('verbose', 'Loading middleware...');

  // Get the express app
  var app = S.get('app');

  // Register middleware
  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.text());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(flash());
  app.use(session({
    secret: S.get('config.core.secret'),
    store:  require('../lib/resources/sessionStore'),
    // May need to be changed
    resave: true,
    saveUninitialized: true
  }));

  // Done
  callback(null);
}];