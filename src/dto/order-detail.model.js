const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('order_detail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        changed_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discounted_price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        discount: {
            type: DataTypes.DECIMAL(4,2),
            allowNull: false,
        },
    }, {schema: 'ecsplus', underscored: true, freezeTableName: true});
};


