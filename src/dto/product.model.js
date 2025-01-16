const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        changed_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.ENUM("k", "m", "p"),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        max_discount: {
            type: DataTypes.DECIMAL(4,2),
            allowNull: false,
        },
        qrcode: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {schema: 'ecsplus', underscored: true, freezeTableName: true});
};


