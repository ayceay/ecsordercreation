//load all the environment variables

const { json } = require('express');
const fs = require('fs');
const path = require('path');
const desiredPath = path.resolve(__dirname, './.env');
console.log("desired path: "+desiredPath );

console.log("i am here-1");

if (fs.existsSync(desiredPath)) {
  console.log("i am here-2");
    // Load environment variables from .env file
    require('dotenv').config({path: desiredPath})
}

const envs = {
  employeeDatabaseUser : process.env.EMPLOYEE_DATABASE_USERNAME,
  employeeDatabasePassword : process.env.EMPLOYEE_DATABASE_PASSWORD,
  employeeDatabaseHost : process.env.EMPLOYEE_DATABASE_HOST,
  employeeDatabasePort : process.env.EMPLOYEE_DATABASE_PORT,
  employeeDatabaseName : process.env.EMPLOYEE_DATABASE_NAME
};

module.exports = envs;