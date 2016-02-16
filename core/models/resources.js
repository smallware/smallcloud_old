
module.exports = {
  atts: {
    id: {
      type: S.orm.types.STRING,
      primaryKey: true
    },
    name: {
      type: S.orm.types.STRING
    },
    version: {
      type: S.orm.types.STRING
    },
    active: {
      type: S.orm.types.BOOLEAN,
      defaultValue: false
    },
    activable: {
      type: S.orm.types.BOOLEAN,
      defaultValue: false
    },
    description: {
      type: S.orm.types.STRING
    },
    path: {
      type: S.orm.types.STRING
    }
  }
};


//module.exports = {
//  atts: {
//    id: {
//      type: S.orm.types.STRING,
//      primaryKey: true
//    },
//    provider: {
//      type: S.orm.types.STRING,
//      primaryKey: true
//    },
//    preferred: {
//      type: S.orm.types.BOOLEAN
//    },
//    description: {
//      type: S.orm.types.STRING
//    }
//  }
//};