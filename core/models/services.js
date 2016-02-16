
module.exports = {
  atts: {
    id: {
      type: S.orm.types.STRING,
      primaryKey: true
    },
    active: {
      type: S.orm.types.BOOLEAN,
      defaultValue: true
    },
    activable: {
      type: S.orm.types.BOOLEAN,
      defaultValue: true
    },
    name: {
      type: S.orm.types.STRING
    },
    icon: {
      type: S.orm.types.STRING
    },
    description: {
      type: S.orm.types.STRING
    },
    version: {
      type: S.orm.types.STRING
    },
    author: {
      type: S.orm.types.STRING,
      set: function(author){
        this.setDataValue('author', JSON.stringify(author));
      },
      get: function(){
        return JSON.parse(this.getDataValue('author'));
      }
    }
    //resources: {
    //  type: S.orm.types.STRING,
    //  set: function(resources){
    //    this.setDataValue('resources', JSON.stringify(resources));
    //  },
    //  get: function(){
    //    return JSON.parse(this.getDataValue('resources'));
    //  }
    //}
  }
};