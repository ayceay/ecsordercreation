class User {
    constructor(data) {
        this.id = data.id;
        this.changed_by = data.changed_by;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.name = data.name;
        this.surname = data.surname;
        this.username = data.username;
        this.password = data.password;
    }

    static fromDatabaseRow(row) {
        return new User({
            id: row.id,
            changed_by: row.first_name,
            created_at: row.last_name,
            updated_at: row.email,
            name: row.name,
            surname: row.surname,
            username: row.username,
            password: row.password
        });
    }

    toDatabaseObject() {
        return {
            id: this.id,
            changed_by: this.first_name,
            created_at: this.last_name,
            updated_at: this.email,
            name: this.name,
            surname: this.surname,
            username: this.username,
            password: this.password
        };
    }
}

module.exports = User;