const db = require("../dto");
const qg = require("../query-generator/query-generator-util");
const productGroup = db.product_group;
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

// Create and Save a new Product Group
exports.create = async (req, res, next) => {
    /*  #swagger.tags = ['Product Group']
           #swagger.description = 'Create new product group.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductGroup"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        // in case request params meet the validation criteria
        const productGroupModel = {

            changed_by: '-',
            created_at: Date.now,
            updated_at: null,
            name: req.body.name
            //
        };

        // Save product group in the database
        productGroup.create(productGroupModel)
            .then(data => {
                res.send(data);
                /* #swagger.responses[200] = {
                     description:   "User registered successfully",
                     schema: { "$ref": "#/components/schemas/ProductGroup" }
                } */
            })
            .catch(err => {
                // #swagger.responses[500] = { description: 'Some error occurred while creating the Product Group...' }
                next(new CustomError(
                    err.message || "Some error occurred while creating the Product Group.")
                );
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create a Product Group

};

// Retrieve all Produt Group from the database.
exports.queryPage = async (req, res, next) => {
    /*  #swagger.tags = ['Product Group']
       #swagger.description = 'Get all product group as paginated.' */
    /*  #swagger.requestBody = {
                   required: true,
                   content: {
                       "application/json": {
                           schema: {
                               $ref: "#/components/schemas/ProductGroupQuery"
                           }
                       }
                   }
               }
           */
    const {page, size, filter} = req.body;

    let condition = qg.prepareFilterCondition(filter);

    const {limit, offset} = getPagination(page, size);

    productGroup.findAndCountAll({where: condition, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            /* #swagger.responses[200] = {
                 description:   "get product groups data as paginated",
                 schema: { "$ref": "#/components/schemas/ProductGroupPaginationModel" }
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving product groups...' }
            next(new CustomError(err.message || "Some error occurred while retrieving product groups."));
        });
};

// Find a single Product Group with an id
exports.findOne = async (req, res, next) => {
    /*  #swagger.tags = ['Product Group']
   #swagger.description = 'Get specific product group.' */
    // #swagger.parameters['id'] = { description: 'product group id', required:true, type: number}
    const id = req.params.id;

    productGroup.findByPk(id)
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "Product Group has been founded",
                 schema: { "$ref": "#/components/schemas/ProductGroup" }
            } */
        })
        .catch(err => {
            // #swagger.responses[500] = { description: 'Error retrieving product group...' }
            next(new CustomError(
                "Error retrieving User with id=" + id)
            );
        });
};

// Update a Product Group by the id in the request
exports.update = async (req, res, next) => {
    /*  #swagger.tags = ['Product Group']
           #swagger.description = 'Update new product group.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductGroup"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;

        productGroup.update(req.body, {
            fields: ['name'],
            where: {id: id}
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Product Group was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Product Group with id=${id}. Maybe Product Group was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );
                // #swagger.responses[500] = { description: 'Error updating Product Group...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Delete a Product Group with the specified id in the request
exports.delete = async (req, res, next) => {
    /*  #swagger.tags = ['Product Group']
        #swagger.description = 'Delete product group.' */
    // #swagger.parameters['id'] = { description: 'product group id', required:true, type: number}

    const id = req.params.id;

    productGroup.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product Group was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product Group with id=${id}. Maybe Product Group was not found!`
                });
            }
        })
        .catch(err => {
            next(new CustomError(
                "Could not delete User with id=" + id)
            );
            // #swagger.responses[500] = { description: 'Could not delete Product Group...' }

        });
};

// Delete all Product Groups from the database.
exports.deleteAll = async (req, res, next) => {
    /*  #swagger.tags = ['Product Group']
        #swagger.description = 'Delete all product group.' */
    productGroup.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} product groups were deleted successfully!`});
        })
        .catch(err => {
            next(new CustomError(
                err.message || "Some error occurred while removing all product groups.")
            );
            // #swagger.responses[500] = { description: 'Some error occurred while removing all product groups...' }

        });
};


  