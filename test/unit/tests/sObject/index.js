//
//var chai   = require('chai');
//var rewire = require('rewire');
//
//// Setup
//chai.should();
//var smallcloud = rewire('../../../core');
//
//module.exports = {};
//
//var __OLD = function(){
//
//  describe('S-Object', function(){
//
//    describe('S-Object public properties', function(){
//
//      describe('S-Object logger', function(){
//
//        it('Should have a log() method', function(){
//          smallcloud.should.have.property('log');
//        });
//
//      });
//
//
//      describe('S.orm property', function(){
//
//        it('Should have a "orm" property', function(){
//          smallcloud.should.have.property('orm');
//        });
//
//        it('S.orm should have a "types" property', function(){
//          smallcloud.orm.should.have.property('types');
//        });
//
//        it('S.orm.types should have 17 properties', function(){
//          var properties = Object.keys(smallcloud.orm.types);
//          properties.should.have.length(17);
//        });
//
//      });
//
//    });
//
//
//
//    describe('S-Object protected properties', function(){
//
//      ['set', 'get'].forEach(function(method){
//
//        describe('S.'+method+'() method', function(){
//
//          it('S-Object should have a "'+method+'()" method', function(){
//            smallcloud.should.have.property(method);
//          });
//
//          it('S.set() should be hidden', function(){
//            var publics = Object.keys(smallcloud);
//            publics.should.not.have.property(method);
//          });
//
//          it('Should throw error if called from outside /core folder', function(){
//            smallcloud[method].should.throw(Error);
//          });
//
//        });
//
//      });
//
//      describe('S.init() method', function(){
//
//        it('S-Object should have a "init()" method', function(){
//          smallcloud.should.have.property('init');
//        });
//
//        it('S.set() should be hidden', function(){
//          var publics = Object.keys(smallcloud);
//          publics.should.not.have.property('init');
//        });
//
//        it('Should throw error if not called from smallcloud.js', function(){
//          smallcloud.init.should.throw(Error);
//        });
//
//      });
//
//    });
//
//
//
//  });
//};