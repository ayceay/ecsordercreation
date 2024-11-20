// class User {
//     constructor(data) {
//         this.id = data.id;
//         this.changed_by = data.changed_by;
//         this.created_at = data.created_at;
//         this.updated_at = data.updated_at;
//         this.name = data.name;
//         this.surname = data.surname;
//         this.username = data.username;
//         this.password = data.password;
//     }

//     static fromDatabaseRow(row) {
//         return new User({
//             id: row.id,
//             changed_by: row.first_name,
//             created_at: row.last_name,
//             updated_at: row.email,
//             name: row.name,
//             surname: row.surname,
//             username: row.username,
//             password: row.password
//         });
//     }

//     toDatabaseObject() {
//         return {
//             id: this.id,
//             changed_by: this.first_name,
//             created_at: this.last_name,
//             updated_at: this.email,
//             name: this.name,
//             surname: this.surname,
//             username: this.username,
//             password: this.password
//         };
//     }
// }

// module.exports = User;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { schema: 'ecsplus', underscored: true, freezeTableName: true });

    return User;
};