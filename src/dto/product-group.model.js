const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('product_group', {
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
        }
    }, {schema: 'ecsplus', underscored: true, freezeTableName: true});
};


