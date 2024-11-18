const User = require('../dto/user');

class UserRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async getByUsername(username) {
        try {
            const result = await this.pool.query('SELECT id, changed_by, created_at, updated_at, name, surname, username, password FROM users WHERE username = $1', [username]);
            console.log(result.rows[0]);
            return User.fromDatabaseRow(result.rows[0]);
        } catch (err) {
            return err;
        }
    }
}

module.exports = UserRepository;