//load all the environment variables

const { json } = require('express');
const fs = require('fs');
const path = require('path');
const desiredPath = path.resolve(__dirname, './.env');

if (fs.existsSync(desiredPath)) {
    // Load environment variables from .env file
    require('dotenv').config({path: desiredPath})
}


module.exports = {
  HOST: process.env.DATABASE_HOST,
  USER: process.env.DATABASE_USERNAME,
  PASSWORD: process.env.DATABASE_PASSWORD,
  DB: process.env.DATABASE_NAME,
  dialect: process.env.DATABASE_DIALECT,
  jwt: {
    // The secret is used to sign and validate signatures.
    secret: process.env.JWT_SECRET,
    // The audience and issuer are used for validation purposes.
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};