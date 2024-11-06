class Employee {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
    }

    static fromDatabaseRow(row) {
        return new Employee({
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email
        });
    }

    toDatabaseObject() {
        return {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email
        };
    }
}

module.exports = Employee;