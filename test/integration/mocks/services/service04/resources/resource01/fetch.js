
module.exports = function *(next){

  // XXX
  console.log('>>> Running Service 04 Resource 01 middleware FETCH downstream');

  yield next;

  // XXX
  console.log('>>> Running Service 04 Resource 01 middleware FETCH upstream');

};