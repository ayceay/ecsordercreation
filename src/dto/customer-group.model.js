const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('customer_group', {
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
        max_discount: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
        }
    }, {schema: 'ecsplus', underscored: true, freezeTableName: true});
};