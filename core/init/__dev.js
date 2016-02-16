
var langUtils = require('../lib/util/lang');
var router    = require('../lib/resources/router');
var _         = require('lodash');



module.exports = ['resources', function(callback){

  // Verbose
  S.log('debug', '===== Running DEV init =====');

  //Inspect router contents
  var table = router.getAll();
  console.log('  ');
  console.log('>>> Routing table', table);

  // Inspect S-Object
  console.log('  ');
  console.log('>>> S-Object', _.omit(S, 'orm'));

  //Get active services
  //console.log('  ');
  //console.log('>>> Services:', S.get('services'));
  //
  //S.resource01.fetch().catch(function(err){
  //  console.error(err.stack);
  //});




  // Minimally populate database
  //langUtils.genCallback(function *(){
  //
  //  //// Mocks
  //  //var mocks = [
  //  //  {key: 'uno',    value: 'one'},
  //  //  {key: 'dos',    value: 'two'},
  //  //  {key: 'tres',   value: 'three'},
  //  //  {key: 'cuatro', value: 'four'},
  //  //  {key: 'cinco',  value: 'five'},
  //  //  {key: 'seis',   value: 'six'},
  //  //  {key: 'siete',  value: 'seven'},
  //  //  {key: 'ocho',   value: 'eight'},
  //  //  {key: 'nueve',  value: 'nine'},
  //  //  {key: 'diez',   value: 'ten'}
  //  //];
  //
  //  //console.log('   ');
  //  //
  //  //// Insert mock data
  //  //var returned = yield mocks.map(function(mock){
  //  //
  //  //  // XXX
  //  //  console.log('CCC:', mock.key);
  //  //
  //  //  return S.settings.create({
  //  //    data: mock
  //  //  }).then(function(response){
  //  //    return response.data;
  //  //  }).catch(function(err){
  //  //    console.log('\n=== ERROR ===');
  //  //    console.error(err);
  //  //  });
  //  //});
  //
  //
  //  //var retKeys = returned.map(function(item){
  //  //  console.log('GGG:', item.key);
  //  //  return item.key;
  //  //});
  //  ////console.log('  > KEYS:', retKeys);
  //
  //
  //  //// XXX
  //  //var mockKeys = mocks.map(function(mock){
  //  //  console.log('>>> TOUCH:', mock.key);
  //  //  return mock.key;
  //  //});
  //  //console.log('  > KEYS:', mockKeys);
  //  //
  //  //console.log('   ');
  //
  //  //// Cleanup
  //  //yield mocks.map(function(mock){
  //  //
  //  //  // XXX
  //  //  console.log('XXX', mock.key);
  //  //
  //  //  return S.settings.remove({
  //  //    query: mock
  //  //  });
  //  //});
  //
  //
  //
  //  //// Create admin user
  //  //var userResponse = yield S.users.create({
  //  //  data: {
  //  //    firstname: 'sys',
  //  //    lastname:  'admin',
  //  //    nick:      'admin',
  //  //    email:     'admin@small.cloud',
  //  //    avatar:    'admin-avatar.jpg',
  //  //    password:  '0987654321'
  //  //  }
  //  //});
  //
  //  //// XXX
  //  //var xxx = yield S.users.create({
  //  //  data: {
  //  //    firstname: 'sys',
  //  //    lastname:  'admin',
  //  //    nick:      'admin',
  //  //    email:     'admin@small.cloud',
  //  //    avatar:    'admin-avatar.jpg',
  //  //    password:  '0987654321'
  //  //  }
  //  //});
  //  //console.log('>>>', xxx);
  //
  //  //// Create admin group
  //  //var groupResponse = yield S.groups.create({
  //  //  data: {
  //  //    name: 'admin',
  //  //    icon: 'admin-icon.jpg'
  //  //  }
  //  //});
  //
  //  //// XXX
  //  //yield S.users.remove({
  //  //  query: {id: 1}
  //  //});
  //
  //
  //
  //}, callback);

  // XXX
  //console.log('\n>>> SERVICE:', S.get('services'));

  callback();
}];