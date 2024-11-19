//employeeRespository.js

const Employee = require('../dto/employee');

class EmployeeRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async getAll() {
        try {
            const result = await this.pool.query('SELECT id, first_name, last_name, email FROM employees');
            if(result){
            return result.rows.map(row => Employee.fromDatabaseRow(row));

            }
            return null;
        } catch (err) {
            return err;
        }
    }

    async getById(id) {
        try {
            const result = await this.pool.query('SELECT id, first_name, last_name, email FROM employees WHERE id = $1', [id]);
            return Employee.fromDatabaseRow(result.rows[0]);
        } catch (err) {
            return err;
        }
    }

    async add(employeeData) {
        try {
            const employee = new Employee(employeeData);
            const result = await this.pool.query('INSERT INTO employees (id, first_name, last_name, email) VALUES ($1, $2, $3, $4) RETURNING *', [
                employee.id,
                employee.firstName,
                employee.lastName,
                employee.email
            ]);
            return Employee.fromDatabaseRow(result.rows[0]);
        } catch (err) {
            return err;
        }
    }

    async update(employeeData) {
        try {
            const employee = new Employee(employeeData);
            const result = await this.pool.query('UPDATE employees SET first_name = $2, last_name = $3, email = $4 WHERE id = $1 RETURNING *', [
                employee.id,
                employee.firstName,
                employee.lastName,
                employee.email
            ]);
            return Employee.fromDatabaseRow(result.rows[0]);
        } catch (err) {
            return err;
        }
    }

    async deleteById(id) {
        try {
            await this.pool.query('DELETE FROM employees WHERE id = $1', [id]);
            return { message: 'Employee deleted successfully' };
        } catch (err) {
            return err;
        }
    }
}

module.exports = EmployeeRepository;