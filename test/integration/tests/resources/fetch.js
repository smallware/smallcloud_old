
var _    = require('lodash');
var chai = require('chai');

// Setup
chai.should();
var expect = chai.expect;

// Mocks
var mocks = [
  {key: 'uno',    value: 'one'},
  {key: 'dos',    value: 'two'},
  {key: 'tres',   value: 'three'},
  {key: 'cuatro', value: 'four'},
  {key: 'cinco',  value: 'five'},
  {key: 'seis',   value: 'six'},
  {key: 'siete',  value: 'seven'},
  {key: 'ocho',   value: 'eight'},
  {key: 'nueve',  value: 'nine'},
  {key: 'diez',   value: 'ten'}
];


// Tests
module.exports = function(){

  describe('Fetch resources', function(){

    before(function *(){

      // Insert mock data
      mocks = yield mocks.map(function(mock){
        return S.settings.create({
          data: mock
        }, {user: 'andres'}).then(function(response){
          return response.data;
        });
      });

    });

    describe('S.resource.fetch()', function(){

      it('Should return a all items when called without params', function *(){

        var response = yield S.settings.fetch();

        response.data.should.be.an('array').with.length(mocks.length);
        response.data.forEach(function(item){
          expect(item).to.satisfy(function(i){ return _.isPlainObject(i) });
        });

      });
      it('Should return a single item when called with an ID value', function *(){

        var response = yield S.settings.fetch(mocks[0].id);

        expect(response.data).to.not.be.an('array');
        expect(response.data).to.satisfy(function(i){ return _.isPlainObject(i) });

      });
      it('Should return a collection when called with ID array', function *(){

        var response = yield S.settings.fetch([
          mocks[0].id,
          mocks[1].id,
          mocks[2].id
        ]);

        response.data.should.be.an('array').with.length(3);

        var count = 0;
        response.data.forEach(function(item){
          expect(item).to.satisfy(function(i){ return _.isPlainObject(i) });
          expect(item.id).to.equal(mocks[count].id);
          count++;
        });

      });
      it('Should return a single item when called with field value', function *(){

        var response = yield S.settings.fetch({
          query: {key: 'uno'}
        });

        expect(response.data).to.not.be.an('array');
        expect(response.data).to.satisfy(function(i){ return _.isPlainObject(i) });

      });

      it('Should only return specified fields for query with attributes', function *(){

        var response = yield S.settings.fetch({
          query: {attributes: ['key']}
        });

        expect(response.data).to.be.an('array').with.length(mocks.length);
        response.data.forEach(function(item){
          expect(item).to.satisfy(function(i){ return _.isPlainObject(i) });
          expect(item).to.not.have.any.keys('id', 'value');
          expect(item).to.have.key('key');
        });

      });
      it('Should only return specified number of elements when limit provided', function *(){

        var response = yield S.settings.fetch({
          query: {limit: 3}
        });

        expect(response.data).to.be.an('array').with.length(3);
        response.data.forEach(function(item){
          expect(item).to.satisfy(function(i){ return _.isPlainObject(i) });
        });

      });

      it('Should throw "404 - Not Found" error with non-existing field value', function *(){

        var response = yield S.settings.fetch({
          query: {key: 'nonKey'}
        }).catch(function(err){

          expect(err.status).to.equal(404);
          expect(err.message).to.equal('Not Found');
          //expect(err.description).to.equal('settings entry could not be found');

        });

        expect(response).to.be.undefined;

      });
      it('Should throw "404 - Not Found" error for non-existing ID', function *(){

        var response = yield S.settings.fetch('nonID').catch(function(err){

          expect(err.status).to.equal(404);
          expect(err.message).to.equal('Not Found');
          //expect(err.description).to.equal('There is no resource settings with id = nonID');

        });

        expect(response).to.be.undefined;

      });
      it('Should throw "400 - Bad Request" error for data in request', function *(){

        var response = yield S.settings.fetch({
          data: {allowed: false}
        }).catch(function(err){

          expect(err.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          expect(err.description).to.equal('Request must not contain data');

        });

        expect(response).to.be.undefined;

      });
      it('Should throw "400 - Bad Request" error for non-existing relationship', function *(){

        var response = yield S.settings.fetch({
          rel: {
            resource: 'nonRel',
            id: 42
          }
        }).catch(function(err){

          expect(err.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          expect(err.description).to.equal('Resource nonRel is not related to settings');

        });

        expect(response).to.be.undefined;

      });
      it('Should throw "400 - Bad Request" error for malformed relationship', function *(){

        var response1 = yield S.settings.fetch({
          rel: {
            re: 'nonRel',
            id: 42
          }
        }).catch(function(err){

          expect(err.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          expect(err.description).to.equal('Malformed relationship query');

        });

        expect(response1).to.be.undefined;

        var response2 = yield S.settings.fetch({
          rel: {
            resource: 'nonRel'
          }
        }).catch(function(err){

          expect(err.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          expect(err.description).to.equal('Malformed relationship query');

        });

        expect(response2).to.be.undefined;

      });

    });

    after(function *(){

      // Cleanup
      //yield mocks.map(function(mock){
      //
      //  return S.settings.remove({
      //    query: mock
      //  });
      //});

    });

  });

};