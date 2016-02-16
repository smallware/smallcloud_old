
var _ = require('lodash');

module.exports = {
  atts: {
    sid: {
      type: S.orm.types.STRING,
      primaryKey: true
    },
    expires: {
      type: S.orm.types.DATE,
      allowNull: true
    },
    data: {
      type: S.orm.types.TEXT,
      set: function(data){
        this.setDataValue('data', JSON.stringify( data ));
      },
      get: function(){

        var data = this.getDataValue('data');

        if( _.isString(data) )
          return JSON.parse( data );
        else
          return null;
      }
    }
  }
};