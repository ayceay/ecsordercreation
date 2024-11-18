console.log("swagger is creating...");
const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});


const doc = {
    info: {
        version: "1.0.0",
        title: "Student API"
    },
    host: "localhost:5002",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Student",
            "description": "Endpoints"
        }
    ]
}

const outputFile = './.swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./bin/www'); // Your project's root file
});