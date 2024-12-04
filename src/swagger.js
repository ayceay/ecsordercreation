console.log("swagger is creating...");
const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});


const doc = {
    info: {
        version: "1.0.0",
        title: "ECS API"
    },
    host: "localhost:5002",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Ecs",
            "description": "Endpoints"
        }
    ],
    components: {
        schemas: {
            User: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                $name: "req.body.name",
                $surname: "req.body.surname",
                $username: "req.body.username",
                password: "req.body.password"
            },
            FindAll: {
                totalItems: 3,
                tutorials: {type: "array", allOf:[{$ref: "#components/schemas/User"}]},
                totalPages: 1,
                currentPage: 0
            },
            Authentication: {
                surname: "req.body.surname",
                password: "req.body.password"
            },
            Query: {
                page: 1,
                size: 1,
                filter: {
                    type: "object", $ref: "#/components/schemas/User"
                }
            },
            ProductGroup: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                $name: "req.body.name"
            },
            ProductGroupQuery: {
                page: 1,
                size: 1,
                filter: {
                    type: "object", $ref: "#/components/schemas/ProductGroup"
                }
            },
            ProfileGroupPaginationModel: {
                totalItems: 3,
                tutorials: {type: "array", allOf:[{$ref: "#components/schemas/ProductGroup"}]},
                totalPages: 1,
                currentPage: 0
            },
        }
    }
}

const outputFile = './.swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www'); // Your project's root file
});