const db = require("../dto");
const qg = require("../query-generator/query-generator-util");
const customer = db.customer;
const customer_group = db.customer_group;
const {validationResult} = require("express-validator");
const CustomError = require("../exception/customError");
var QRCode = require('qrcode')


const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return {limit, offset};
};

const getPagingData = (data, page, limit) => {
    const {count: totalItems, rows: tutorials} = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {totalItems, tutorials, totalPages, currentPage};
};

// Create and Save a new Customer
exports.create = async (req, res, next) => {
    /*  #swagger.tags = ['Customer']
           #swagger.description = 'Create new customer.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Customer"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        // in case request params meet the validation criteria
        const customerModel = {

            changed_by: '-',
            created_at: Date.now,
            updated_at: null,
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            address: req.body.address,
            customer_group_id: req.body.customer_group_id

            //
        };

        // Save Customer in the database
        customer.create(customerModel)
            .then(data => {
                res.send(data);
                /* #swagger.responses[200] = {
                     description:   "Customer registered successfully",
                     schema: { "$ref": "#/components/schemas/Customer" }
                } */
            })
            .catch(err => {
                // #swagger.responses[500] = { description: 'Some error occurred while creating the Customer...' }
                next(new CustomError(
                    err.message || "Some error occurred while creating the Customer.")
                );
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create a Customer

};

// Retrieve all Customer from the database.
exports.queryPage = async (req, res, next) => {
    /* #swagger.tags = ['Customer']
       #swagger.description = 'Get all customer as paginated.' */
    /*  #swagger.requestBody = {
                   required: true,
                   content: {
                       "application/json": {
                           schema: {
                               $ref: "#/components/schemas/CustomerQuery"
                           }
                       }
                   }
               }
           */
    const {page, size, filter} = req.body;

    let condition = qg.prepareFilterCondition(filter);
    console.log(condition);

    const {limit, offset} = getPagination(page, size);

    customer.findAndCountAll({
        include: [{model: customer_group, attributes: ['name'], required: false}], where: condition,
        limit,
        offset
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            /* #swagger.responses[200] = {
                 description:   "get customer data as paginated",
                 schema: { "$ref": "#/components/schemas/CustomerPaginationModel" }
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving customer...' }
            next(new CustomError(err.message || "Some error occurred while retrieving customer."));
        });
};

// Find a single Customer with an id
exports.findOne = async (req, res, next) => {
    /*  #swagger.tags = ['Customer']
   #swagger.description = 'Get specific customer.' */
    // #swagger.parameters['id'] = { description: 'customer id', required:true, type: number}
    const id = req.params.id;

    customer.findByPk(id)
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "Customer has been founded",
                 schema: { "$ref": "#/components/schemas/Customer" }
            } */
        })
        .catch(err => {
            // #swagger.responses[500] = { description: 'Error retrieving customer...' }
            next(new CustomError(
                "Error retrieving User with id=" + id)
            );
        });
};

// Update a Customer by the id in the request
exports.update = async (req, res, next) => {
    /*  #swagger.tags = ['Customer']
           #swagger.description = 'Update customer.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Customer"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;

        customer.update(req.body, {
            fields: ['name', 'surname', 'phone', 'address', 'customer_group_id'],
            where: {id: id}
        })
            .then(num => {
                if (num === 1) {
                    res.send({
                        message: "Customer was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );
                // #swagger.responses[500] = { description: 'Error updating Customer...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};


// Delete a Customer with the specified id in the request
exports.delete = async (req, res, next) => {
    /*  #swagger.tags = ['Customer']
        #swagger.description = 'Delete customer.' */
    // #swagger.parameters['id'] = { description: 'customer id', required:true, type: number}

    const id = req.params.id;

    customer.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Customer was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
                });
            }
        })
        .catch(err => {
            next(new CustomError(
                "Could not delete User with id=" + id)
            );
            // #swagger.responses[500] = { description: 'Could not delete Customer...' }

        });
};

// Delete all Customers from the database.
exports.deleteAll = async (req, res, next) => {
    /*  #swagger.tags = ['Customer']
        #swagger.description = 'Delete all customer.' */
    customer.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} customers were deleted successfully!`});
        })
        .catch(err => {
            next(new CustomError(
                err.message || "Some error occurred while removing all customers.")
            );
            // #swagger.responses[500] = { description: 'Some error occurred while removing all customers...' }

        });
};


  