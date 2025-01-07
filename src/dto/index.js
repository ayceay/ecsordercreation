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
db.customer_group = require("./customer-group.model")(sequelize, Sequelize);
db.customer = require("./customer.model")(sequelize, Sequelize);
db.order = require("./order.model")(sequelize, Sequelize);
db.order_detail = require("./order-detail.model")(sequelize, Sequelize);

db.product.belongsTo(db.product_group, {foreignKey: 'product_group_id'});
db.product_group.hasMany(db.product);

db.customer.belongsTo(db.customer_group, {foreignKey: 'customer_group_id'});
db.customer_group.hasMany(db.customer);

db.order_detail.belongsTo(db.order, {foreignKey: 'order_id'});
db.order.hasMany(db.order_detail);

db.order.belongsTo(db.customer, {foreignKey: 'customer_id'});


module.exports = db;
