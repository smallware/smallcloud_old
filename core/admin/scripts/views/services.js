
define(function(){

    var ListItem = function(item){
        this.id   = item.id;
        this.name = item.name;
        this.icon = item.icon;
        this.desc = item.desc;
        this.deps = item.deps || {};

        this.isEnabled = item.isEnabled || false;
        this.isActive  = false;
    }

    ListItem.prototype.onChange = function(reqItem){
        if(reqItem.id === this.id)
            this.isActive = true;
        else
            this.isActive = false;
    };



    var List = function(listItems){
        this.handlers = [];
        this.list = listItems.map(function(item){
            var instance = new ListItem(item);
            this.handlers.push(instance.onChange.bind(instance));
            return instance;
        }, this);
    };

    List.prototype.activate = function(item){
        this.handlers.forEach(function(handler){
            handler(item);
        });
    };


    // Dummy data /////////////////////////////////////////////////////////////
    var servList = [
        {
            id:   'smallStorage',
            name: 'Small Storage',
            icon: '/core/images/storage.svg',
            desc: 'Data storage and tracking',
            isEnabled: true,
            deps: {}
        },
        {
            id:   'smallFederation',
            name: 'Small Federation',
            icon: '/core/images/federation.svg',
            desc: 'Data federation capabilities',
            isEnabled: true
        },
        {
            id:   'smallData',
            name: 'Small Data',
            icon: '/core/images/data.svg',
            desc: 'Just like FireBase',
            isEnabled: true
        },
        {
            id:   'smallMultimedia',
            name: 'Small Multimedia',
            icon: '/core/images/picture.svg',
            desc: 'Multimedia handling capabilities',
            isEnabled: false
        }
    ];


    // Controller function ////////////////////////////////////////////////////
    return function($scope){

        // Banner
        $scope.banner = {
            icon: '/core/images/services.svg',
            desc: 'Here you can activate, deactivate and configure your installed services and the usage policies'
        };

        // Retrieve services
        var services = new List(servList);
        $scope.services = services.list;

        // Make first service active
        services.activate(services.list[0]);
        $scope.selected = services.list[0];

        // Item select handler
        $scope.select = function(service){
            services.activate(service);
            $scope.selected = service;
        };
    };

});