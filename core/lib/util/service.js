
var path = require('path');

module.exports = {

  // Get service ID form path
  srvFromPath: function(srvPath){

    // XXX
    console.log('srvFromPath', srvPath);

    var regex   = /^(.*)\/services\/([a-zA-Z0-9]+-?[a-zA-Z0-9]+)\/.+$/;
    var matches = srvPath.match(regex);

    var basePath = path.resolve(__dirname, '../../');
    var services = S.get('services');

    // Validate matches
    if( !matches )
      return null;

    // Validate base path
    if( basePath !== matches[1])
      return null;

    // Validate service ID
    if( !(matches[2] in services) )
      return null;

    // Done
    return services[matches[2]];
  }
};