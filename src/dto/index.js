const dbConfig = require("../common/config.js");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.product_group = require("./product-group.model")(sequelize, Sequelize);
db.product = require("./product.model")(sequelize, Sequelize);

db.product.belongsTo(db.product_group, {foreignKey: 'product_group_id'});
db.product_group.hasMany(db.product);

module.exports = db;
