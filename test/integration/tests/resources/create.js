
var _    = require('lodash');
var chai = require('chai');

// Setup
var expect = chai.expect;
var random;
var mockUser;


// Tests
module.exports = function(){

  //describe('Create resources', function(){
  //
  //  before(function(){
  //
  //    // Setup
  //    random = Date.now();
  //    mockUser = {
  //      firstname: 'first' + random,
  //      lastname:  'last' + random,
  //      nick:      random.toString(),
  //      email:     random + '@test.com',
  //      password:  '1234567890',
  //      avatar:    random + '.jpg'
  //    };
  //  });
  //
  //  describe('S.resource.create()', function(){
  //    it('Should create a new user', function *(){
  //
  //
  //      // Run
  //      var response = yield S.users.create({
  //        data: mockUser
  //      });
  //
  //      var compare = _.omit(response.data, 'id', 'createdAt', 'updatedAt', 'password');
  //
  //      // Test
  //      expect(compare).to.deep.equal(_.omit(mockUser, 'password'));
  //      expect(response.created).to.equal(true);
  //
  //    });
  //    it('Should return valid user when creating existing user', function *(){
  //
  //      var response = yield S.users.create({
  //        data: mockUser
  //      });
  //
  //      var compare = _.omit(response.data, 'id', 'createdAt', 'updatedAt', 'password');
  //
  //      expect(compare).to.deep.equal(_.omit(mockUser, 'password'));
  //      expect(response.data).to.have.property('id');
  //      expect(response.created).to.equal(false);
  //
  //    });
  //    it('Should not return data with a password property', function *(){
  //
  //      var response = yield S.users.create({
  //        data: mockUser
  //      });
  //
  //      expect(response.data).to.not.have.property('password');
  //
  //    });
  //  });
  //
  //  after(function(){
  //
  //    // Cleanup
  //    S.users.remove({
  //      query: {nick: mockUser.nick}
  //    });
  //  });
  //
  //});

};