
var _ = require('lodash');
var Sequelize = require('sequelize');


module.exports = {

  // Create model instances from definitions
  createModels: function(definitions){

    // Define instances
    var instances = _.reduce(definitions, function(_instances, def, name){
      _instances[name] = S.get('database').define(name, def.atts, def.options || null);
      return _instances;
    }, {});

    // Register relations
    _.forEach(definitions, function(def, name){

      // Has relations?
      if( !('relations' in def) )
        return;

      // Iterate relations
      def.relations.map(function(rel){
        instances[name][rel.type](instances[rel.model], rel.options);
      });
    });

    // Done
    return instances;
  },

  // ORM types
  types: {
    STRING:  Sequelize.STRING,    // VARCHAR(255)
    TEXT:    Sequelize.TEXT,      // TEXT

    INTEGER: Sequelize.INTEGER,   // INTEGER
    BIGINT:  Sequelize.BIGINT,    // BIGINT
    FLOAT:   Sequelize.FLOAT,     // FLOAT
    REAL:    Sequelize.REAL,      // REAL        PostgreSQL only.
    DOUBLE:  Sequelize.DOUBLE,    // DOUBLE

    DECIMAL: Sequelize.DECIMAL,   // DECIMAL

    DATE:    Sequelize.DATE,      // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
    BOOLEAN: Sequelize.BOOLEAN,   // TINYINT(1)

    ENUM:    Sequelize.ENUM,      // An ENUM with allowed values 'value 1' and 'value 2'
    ARRAY:   Sequelize.ARRAY,     // Defines an array. PostgreSQL only.

    JSON:    Sequelize.JSON,      // JSON column. PostgreSQL only.
    JSONB:   Sequelize.JSONB,     // JSONB column. PostgreSQL only.

    BLOB:    Sequelize.BLOB,      // BLOB (bytea for PostgreSQL)

    UUID:    Sequelize.UUID,      // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: Sequelize.UUIDV1 or Sequelize.UUIDV4 to make sequelize generate the ids automatically)

    RANGE:   Sequelize.RANGE      // Defines int4range range. PostgreSQL only.
  }

};