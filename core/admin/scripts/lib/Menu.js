define(function(){
  var MenuItem = function(item){

    // Store the item
    this.id = item.id;
    this.parent = item.parent;
    this.pkg = item.pkg;
    this.icon = item.icon;
    this.label = item.label;
    this.sub = item.sub || null;


    // Status flags
    this.isActive = false;
    this.isActiveParent = false;
    this.isExpanded = false;
  };

  MenuItem.prototype.changeHandler = function(reqItem){


    // Requested this item?
    if( this.id === reqItem.id ){
      this.isActive = true;
    }
    else{
      this.isActive = false;

      // Requesting a child of this item?
      if( this.id === reqItem.parent )
        this.isActiveParent = true;
      else
        this.isActiveParent = false;
    }

    // Am I expanded?
    this.isExpanded = this.isActive || this.isActiveParent;
  };

///////////////////////////////////////////////////////////////////////////////

  var Menu = function(menuArray){

    this.menu = [];
    this.changeHandlers = [];

    var that = this;
    var instances = menuArray.map(function(item){

      // Instance the menu item
      return new MenuItem(item);

    });

    // Setup
    instances.forEach(function(itemInstance){

      // Bind handler
      var handler = itemInstance.changeHandler.bind(itemInstance);

      // Store change handler
      that.changeHandlers.push(handler);

      // Build tree
      if( !itemInstance.parent ){

        // Get children
        var children = instances.filter(function(item){
          return item.parent === itemInstance.id;
        });

        // Got any children?
        if( 0 < children.length )
          itemInstance.children = children;

        // Insert into menu
        that.menu.push(itemInstance);
      }
    });

  };

  Menu.prototype.getMenu = function(){
    return this.menu;
  };

  Menu.prototype.setActive = function(reqItem){

    // Iterate change handlers
    this.changeHandlers.forEach(function(handler){
      handler(reqItem);
    })

  };

///////////////////////////////////////////////////////////////////////////////


  //var menuObj = {
  //    dashboard: {
  //        parent: null,
  //        pkg: 'admin',
  //        icon: 'speedometer',
  //        label: 'Dashboard',
  //        sub: 'Get a system overview'
  //    },
  //    smallcloud: {
  //        parent: null,
  //        pkg: 'admin',
  //        icon: 'apple-mobileme',
  //        label: 'SmallCloud',
  //        sub: 'Core settings'
  //    },
  //    users: {
  //        parent: 'smallcloud',
  //        pkg: 'admin',
  //        icon: 'human-male-female',
  //        label: 'Users',
  //    },
  //    groups: {
  //        parent: 'smallcloud',
  //        pkg: 'admin',
  //        id: 'groups',
  //        icon: 'google-circles',
  //        label: 'Groups',
  //    },
  //    services: {
  //        parent: 'smallcloud',
  //        pkg: 'admin',
  //        icon: 'layers',
  //        label: 'Services',
  //    }
  //};

  // TODO: Get the real menu data
  var menuArray = [
    {
      id: 'dashboard',
      parent: null,
      pkg: 'core',
      icon: '/core/images/dashboard.svg',
      label: 'Dashboard',
      sub: 'Get a system overview'
    },
    {
      id: 'users',
      parent: null,
      pkg: 'core',
      icon: '/core/images/users.svg',
      label: 'Users',
      sub: 'Manage system users'
    },
    {
      id: 'groups',
      parent: null,
      pkg: 'core',
      icon: '/core/images/groups.svg',
      label: 'Groups',
      sub: 'Manage system groups'
    },
    {
      id: 'services',
      parent: null,
      pkg: 'core',
      icon: '/core/images/services.svg',
      label: 'Services',
      sub: 'Manage installed services'
    },
    {
      id: 'smallcloud',
      parent: null,
      pkg: 'core',
      icon: '/core/images/settings.svg',
      label: 'SmallCloud',
      sub: 'Core settings'
    },
    {
      id: 'test1',
      parent: 'smallcloud',
      pkg: 'core',
      icon: '/core/images/settings.svg',
      label: 'Test 1'
    },
    {
      id: 'test2',
      parent: 'smallcloud',
      pkg: 'core',
      icon: '/core/images/settings.svg',
      label: 'Test 2'
    }
  ];


  // Return menu instance
  return new Menu(menuArray);
});