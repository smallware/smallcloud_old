module.exports = {
  atts: {
    name: {
      type: S.orm.types.STRING,
      primaryKey: true
    },
    icon: {
      type: S.orm.types.STRING
    }
  },
  relations: [
    {
      type: 'belongsToMany',
      model: 'users',
      options: { through: 'users_groups' }
    }
  ],
  options: {}
};