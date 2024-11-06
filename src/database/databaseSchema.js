const fs = require('fs');
var path = require('path');

class DatabaseSchema {
    constructor(pool) {
        this.pool = pool
    }

    async initialize() {
        try {
            // Read the SQL script file
            const scriptPath = path.join(__dirname, './schema.v1.sql'); // Path to your SQL script file
            const script = fs.readFileSync(scriptPath, 'utf8');

            // Execute the SQL script
            await this.pool.query(script)
            console.log('Schema script executed successfully.');
        } catch (error) {
            console.error('Error executing schema creation script:', error);
        }
    }
}

module.exports = DatabaseSchema;