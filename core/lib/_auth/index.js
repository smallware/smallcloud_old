
var _        = require('lodash');
var srvUtils = require('../util/service');

module.exports = {

  // Validate resource use
  canUseResource: function(resId, callerData){

    // Get caller service
    var service = srvUtils.srvFromPath(callerData.filePath);

    // Validate declarations
    return ( _.includes(service.resources.uses, resId) || _.includes(service.resources.requires, resId) );
  }

};