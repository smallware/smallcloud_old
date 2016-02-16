
module.exports = {
  name: 'Settings',
  atts: {
    key: {
      type: S.orm.types.STRING,
      unique: true
    },
    value: {
      type: S.orm.types.STRING
    }
  },
  options: {}
};
