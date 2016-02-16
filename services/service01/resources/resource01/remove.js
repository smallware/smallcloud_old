
module.exports = function *(next){

  // XXX
  console.log('>>> Running Service 01 Resource 01 provider REMOVE downstream');

  yield next;

  // XXX
  console.log('>>> Running Service 01 Resource 01 provider REMOVE upstream');

};