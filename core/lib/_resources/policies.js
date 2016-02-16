
var _ = require('lodash');

module.exports = function *(){

  // Manager private stores
  var sessionUsr  = {};
  var userGroups  = null;
  var resPolicies = null;
  var fixPolicies = {};


  // Policy manager facade
  var polManager = {

    // Update the stores
    update: function *(){

      // Build user to groups map
      userGroups = yield S.get('models.instances.users').findAll({
        include: [S.get('models.instances.groups')]
      }).then(function(users){

        return users.map(function(user){
          return user.get({plain: true});
        });

      }).then(function(users){

        return users.reduce(function(_userGroups, user){
          _userGroups[user.nick] = user.groups.map(function(group){
            return group.name;
          });
          return _userGroups;
        }, {});

      });

      // XXX
      //console.log('>>> USER GROUPS:', userGroups);


      resPolicies = yield S.get('models.instances.resources').findAll({
        include: [S.get('models.instances.groups')]
      }).then(function(resources){

        return resources.map(function(res){
          return res.get({plain: true});
        })

      }).then(function(resources){

        return resources.reduce(function(resPol, res){

          resPol[res.id] = res.groups.reduce(function(grpPol, grp){

            var omitted = ['createdAt', 'updatedAt', 'groupName', 'resourceId'];
            grpPol[grp.name] = _.omit(grp.policies, omitted);

            return grpPol;
          }, {});

          return resPol;
        }, {});

      });

      // Assign fixed policies
      resPolicies = _.assign(resPolicies, fixPolicies);

      // XXX
      //console.log('>>> RESOURCE POLICIES:', resPolicies);

    },

    // Add a new session ID to user map
    addSession: function(sesId, usrId){
      sessionUsr[sesId] = usrId;
    },

    addPolicy: function(resId, group, action, policy){
      var path = [resId, group, action].join('.');
      _.set(fixPolicies, path, policy);
      _.assign(resPolicies, fixPolicies)
    },

    addPolicies: function(resId, group, policies){
      _.forEach(policies, function(policy, action){
        polManager.addPolicy(resId, group, action, policy);
      });

      // XXX
      //console.log('>>> POLICIES:', resPolicies);
    },

    // Determine authorization
    isAllowed: function(sesId, resId, action){

      // Get the user behind the session
      var userId = sessionUsr[sesId];

      // Get the groups the user belongs to
      var groupIds = userGroups[userId];

      // Get policies for requested resource
      var policies = resPolicies[resId];

      // Find group and action combination
      var allowances = groupIds.map(function(grpId){
        // TODO: Group does not exist
        return (grpId in policies)? policies[grpId][action] : true;
      });

      // Is allowed?
      return _.includes(allowances, true);
    }
  };

  // Populate the stores
  yield polManager.update();

  // Return populated policy manager
  return polManager;

};