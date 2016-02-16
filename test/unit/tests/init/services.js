
var chai   = require('chai');
var rewire = require('rewire');

// Setup
chai.should();
var expect       = chai.expect;
var logOutput    = null;
var servicesInit = rewire('../../../../core/init/services');
var srvInitCtx   = rewire('../../../../core/lib/services/initCtx');

module.exports = function(){

  describe('Services init', function(){

    before(function(){

      // Services init rewire
      servicesInit.__set__({
        S: {
          log: function(){ logOutput = arguments; },
          get: function(){ return 'noop'; }
        }
      });

      // Context rewire
      srvInitCtx.__set__({
        fs: {
          readdirSync: function(){ return ['noop']; }
        },
        S: {
          log: function(){ logOutput = arguments; },
          get: function(path){

            // Parse
            var _path = path.split('.');

            // Return mock component
            if('models' === _path[0])
              return {
                findAll: function(){ return [{mock: true}]; },
                build:   function(){ return {}; }
              };

            if('config' === _path[0]){
              if('services' === _path[1])
                return 'mock';
              if('core' === _path[1])
                return '0.1.0';
            }

          }
        }
      });
    });


    describe('#loadServices()', function(){
      it('Should warn about invalid services', function *(){

        // Setup
        var loadServices = servicesInit.__get__('loadServices');

        // Build context
        var ctx = yield srvInitCtx();

        // Run
        loadServices.call(ctx, 'noop');

        // Test
        logOutput.should.have.length(2);
        logOutput[0].should.equal('warn');
        logOutput[1].should.equal('noop is not a valid service');

      });
      it('Should register valid services in context', function *(){

        // Setup
        var loadServices = servicesInit.__get__('loadServices');
        servicesInit.__set__('Service', function(){ return {id: 'mockService'}; });
        servicesInit.__set__('require', function(){});

        // Build context
        var ctx = yield srvInitCtx();

        // Run
        loadServices.call(ctx, 'mock');

        // Test
        ctx.services.getInstance('mockService').should.deep.equal({id: 'mockService'});

      });
      it('Should add valid services to dep graph', function *(){

        // Setup
        var loadServices = servicesInit.__get__('loadServices');
        servicesInit.__set__('Service', function(){ return {id: 'mockService'}; });
        servicesInit.__set__('require', function(){});

        // Build context
        var ctx = yield srvInitCtx();

        // Run
        loadServices.call(ctx, 'mock');

        // Test
        ctx.services.depGraph.hasNode('mockService').should.equal(true);
      });
    });


    describe('#registerResources()', function(){
      it('Should mark existing resource declaration with preferred status', function *(){

        // Setup
        var registerResources = servicesInit.__get__('registerResources');

        // Mocks
        var mockService = {
          id: 'mockService',
          resources: { provides: [{id: 'mockResource'}] }
        };

        // Build context
        var ctx = yield srvInitCtx();

        // Patch ctx methods
        ctx.services = {
          getInstance: function(){ return mockService; }
        };
        ctx.resources = {
          getConfig:   function(){ return {preferred: true}; },
          getProvider: function(){ return {mockProvider: true}; },
          addResource: function(){ addedAsResource = true; },
          addProvider: function(){ addedAsProvider = true; }
        };

        // Run
        registerResources.call(ctx, {id: 'mockService'});

        // Test
        expect(mockService.resources.provides[0])
          .to.have.property('preferred')
          .to.equal(true);

      });
      it('Should set a completely new resource as preferred', function *(){

        // Setup
        var registerResources = servicesInit.__get__('registerResources');

        // Mocks
        var mockService = {
          id: 'mockService',
          resources: { provides: [{id: 'mockResource'}] }
        };

        // Flags
        var addedAsProvider = false;
        var addedAsResource = false;

        // Build context
        var ctx = yield srvInitCtx();

        // Patch ctx methods
        ctx.services = {
          getInstance: function(){ return mockService; }
        };
        ctx.resources = {
          getConfig:   function(){ return false; },
          getProvider: function(){ return false; },
          addResource: function(){ addedAsResource = true; },
          addProvider: function(){ addedAsProvider = true; }
        };

        // Run
        registerResources.call(ctx, {id: 'mockService'});

        // Test
        expect(addedAsProvider).to.equal(true);
        expect(addedAsResource).to.equal(false);
        expect(mockService.resources.provides[0])
          .to.have.property('preferred')
          .to.equal(true);
      });
      it('Should not set a new resource as preferred if a preferred exists', function *(){

        // Setup
        var registerResources = servicesInit.__get__('registerResources');

        // Mocks
        var mockService = {
          id: 'mockService',
          resources: { provides: [{id: 'mockResource'}] }
        };

        // Flags
        var addedAsProvider = false;
        var addedAsResource = false;

        // Build context
        var ctx = yield srvInitCtx();

        // Patch ctx methods
        ctx.services = {
          getInstance: function(){ return mockService; }
        };
        ctx.resources = {
          getConfig:   function(){ return false; },
          getProvider: function(){ return true; },
          addResource: function(){ addedAsResource = true; },
          addProvider: function(){ addedAsProvider = true; }
        };

        // Run
        registerResources.call(ctx, {id: 'mockService'});

        // Test
        expect(addedAsProvider).to.equal(false);
        expect(addedAsResource).to.equal(true);
        expect(mockService.resources.provides[0])
          .to.have.property('preferred')
          .to.equal(false);

      });
    });


    describe('#processDeps', function(){
      it('Should mark as inactivable services not compatible with smallcloud version', function *(){

        // Setup
        var processDeps = servicesInit.__get__('processDeps');

        // Flag
        var inactivable = false;

        // Mocks
        var mockService = {
          id: 'mockService',
          meta: {smallcloud: '0.2.0'},
          resources: { requires: ['mockService_one']}
        };

        // Build context
        var ctx = yield srvInitCtx();

        // Patch ctx methods
        ctx.services = {
          getInstance: function(){ return mockService; },
          setInactivable: function(){ inactivable = true; }
        };
        ctx.resources = {
          getProvider: function(){ return true; }
        };

        // Run
        processDeps.call(ctx, {id: 'mockService'});

        // Test
        expect(inactivable).to.equal(true);

      });
    });


  });
};