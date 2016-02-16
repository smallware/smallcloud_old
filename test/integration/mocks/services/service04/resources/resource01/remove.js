
module.exports = function *(next){

  // XXX
  console.log('>>> Running Service 04 Resource 01 middleware REMOVE downstream');

  yield next;

  // XXX
  console.log('>>> Running Service 04 Resource 01 middleware REMOVE upstream');

};