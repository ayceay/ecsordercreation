const db = require("../dto");
const qg = require("../query-generator/query-generator-util");
const customerGroup = db.customer_group;
const customer = db.customer;
const {validationResult} = require("express-validator");
const CustomError = require("../exception/customError");


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

// Create and Save a new Customer Group
exports.create = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
           #swagger.description = 'Create new customer group.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CustomerGroup"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        // in case request params meet the validation criteria
        const customerGroupModel = {

            changed_by: '-',
            created_at: Date.now,
            updated_at: null,
            name: req.body.name,
            max_discount: req.body.max_discount
            //
        };

        // Save customer group in the database
        customerGroup.create(customerGroupModel)
            .then(data => {
                res.send(data);
                /* #swagger.responses[200] = {
                     description:   "User registered successfully",
                     schema: { "$ref": "#/components/schemas/CustomerGroup" }
                } */
            })
            .catch(err => {
                // #swagger.responses[500] = { description: 'Some error occurred while creating the Customer Group...' }
                next(new CustomError(
                    err.message || "Some error occurred while creating the Customer Group.")
                );
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create a Customer Group

};

// Retrieve all Customer Group as paginated from the database.
exports.queryPage = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
       #swagger.description = 'Get all customer group as paginated.' */
    /*  #swagger.requestBody = {
                   required: true,
                   content: {
                       "application/json": {
                           schema: {
                               $ref: "#/components/schemas/CustomerGroupQuery"
                           }
                       }
                   }
               }
           */
    const {page, size, filter} = req.body;

    let condition = qg.prepareFilterCondition(filter);

    const {limit, offset} = getPagination(page, size);

    customerGroup.findAndCountAll({where: condition, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            /* #swagger.responses[200] = {
                 description:   "get customer groups data as paginated",
                 schema: { "$ref": "#/components/schemas/CustomerGroupPaginationModel" }
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving customer groups...' }
            next(new CustomError(err.message || "Some error occurred while retrieving customer groups."));
        });
};

// Retrieve all Customer Group from the database.
exports.findAll = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
       #swagger.description = 'Get all customer group.' */


    customerGroup.findAll()
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "get all customer group data ",
                 schema: [{ "$ref": "#/components/schemas/CustomerGroup" }]
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving customer groups...' }
            next(new CustomError(err.message || "Some error occurred while retrieving customer groups."));
        });
};

// Find a single Customer Group with an id
exports.findOne = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
   #swagger.description = 'Get specific customer group.' */
    // #swagger.parameters['id'] = { description: 'customer group id', required:true, type: number}
    const id = req.params.id;
    customerGroup.findByPk(id, {attributes: ['name']})
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "Customer Group has been founded",
                 schema: { "$ref": "#/components/schemas/CustomerGroup" }
            } */
        })
        .catch(err => {
            // #swagger.responses[500] = { description: 'Error retrieving customer group...' }
            next(new CustomError(
                "Error retrieving User with id=" + id)
            );
        });
};

// Update a Customer Group by the id in the request
exports.update = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
           #swagger.description = 'Update new customer group.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CustomerGroup"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;

        customerGroup.update(req.body, {
            fields: ['name'],
            where: {id: id}
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Customer Group was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Customer Group with id=${id}. Maybe Customer Group was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );
                // #swagger.responses[500] = { description: 'Error updating Customer Group...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Delete a Customer Group with the specified id in the request
exports.delete = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
        #swagger.description = 'Delete customer group.' */
    // #swagger.parameters['id'] = { description: 'customer group id', required:true, type: number}

    const id = req.params.id;

    customerGroup.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Customer Group was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Customer Group with id=${id}. Maybe Customer Group was not found!`
                });
            }
        })
        .catch(err => {
            next(new CustomError(
                "Could not delete User with id=" + id)
            );
            // #swagger.responses[500] = { description: 'Could not delete Customer Group...' }

        });
};

// Delete all Customer Groups from the database.
exports.deleteAll = async (req, res, next) => {
    /*  #swagger.tags = ['Customer Group']
        #swagger.description = 'Delete all customer group.' */
    customerGroup.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} customer groups were deleted successfully!`});
        })
        .catch(err => {
            next(new CustomError(
                err.message || "Some error occurred while removing all customer groups.")
            );
            // #swagger.responses[500] = { description: 'Some error occurred while removing all customer groups...' }

        });
};


  