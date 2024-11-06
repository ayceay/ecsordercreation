const { Pool } = require('pg');
const { employeeDatabaseUser, employeeDatabaseHost, employeeDatabaseName, employeeDatabasePassword, employeeDatabasePort } = require('../common/config');

const databasePool = new Pool({
    user: employeeDatabaseUser,
    host: employeeDatabaseHost,
    database: employeeDatabaseName,
    password: employeeDatabasePassword,
    port: employeeDatabasePort,
});

module.exports = databasePool;