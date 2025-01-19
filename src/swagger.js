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
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        },
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
            UserPaginationModel: {
                totalItems: 3,
                tutorials: [{$ref: "#components/schemas/User"}],
                totalPages: 1,
                currentPage: 0
            },
            Authentication: {
                surname: "req.body.surname",
                password: "req.body.password"
            },
            UserQueryModel: {
                page: 1,
                size: 1,
                filter: {
                    name: "-",
                    surname: "-",
                    username: "-",
                }
            },
            ProductGroup: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                name: "req.body.name"
            },
            ProductGroupQuery: {
                page: 1,
                size: 1,
                filter: {
                    name: "-"
                }
            },
            ProductGroupPaginationModel: {
                totalItems: 3,
                tutorials: [{$ref: "#components/schemas/ProductGroup"}],
                totalPages: 1,
                currentPage: 0
            },
            Product: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                name: "req.body.name",
                price: "req.body.price",
                max_discount: "req.body.max_discount",
                $product_group_id: "req.body.product_group_id",
                product_group: {
                    name: "-"
                }
            },
            ProductPaginationModel: {
                totalItems: 3,
                tutorials: [{$ref: "#components/schemas/Product"}],
                totalPages: 1,
                currentPage: 0
            },
            ProductQuery: {
                page: 1,
                size: 1,
                $filter: {
                    $name: "-",
                }
            },
            CustomerGroup: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                name: "req.body.name",
                max_discount: "req.body.max_discount"
            },
            CustomerGroupPaginationModel: {
                totalItems: 3,
                tutorials: [{$ref: "#components/schemas/CustomerGroup"}],
                totalPages: 1,
                currentPage: 0
            },
            CustomerGroupQuery: {
                page: 1,
                size: 1,
                $filter: {
                    $name: "-",
                }
            },
            Customer: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                name: "req.body.name",
                surname: "req.body.surname",
                phone: "req.body.phone",
                address: "req.body.address"
            },
            CustomerPaginationModel: {
                totalItems: 3,
                tutorials: [{$ref: "#components/schemas/Customer"}],
                totalPages: 1,
                currentPage: 0
            },
            CustomerQuery: {
                page: 1,
                size: 1,
                $filter: {
                    name: "-",
                    surname: "-",
                    phone: "-",
                }
            },
            OrderDetail: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                discounted_price: "req.body.discounted_price",
                discount: "req.body.discount",
                quantity: "req.body.quantity",
                product_id: "req.body.product_id",

            },
            Order: {
                id: 1,
                changed_by: "-",
                created_at: "Date.now",
                updated_at: "null",
                name: "req.body.name",
                orderDetails: [{$ref: "#components/schemas/OrderDetail"}]
            },
            OrderPaginationModel: {
                totalItems: 3,
                tutorials: [{$ref: "#components/schemas/Order"}],
                totalPages: 1,
                currentPage: 0
            },
            OrderQuery: {
                page: 1,
                size: 1,
                $filter: {
                    $name: "-"
                }
            },
        }
    }
}

const outputFile = './.swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www'); // Your project's root file
});