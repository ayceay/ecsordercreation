const db = require("../dto");
const qg = require("../query-generator/query-generator-util");
const product = db.product;
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

// Create and Save a new Product
exports.create = async (req, res, next) => {
    /*  #swagger.tags = ['Product']
           #swagger.description = 'Create new product.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        // in case request params meet the validation criteria
        const productModel = {

            changed_by: '-',
            created_at: Date.now,
            updated_at: null,
            name: req.body.name,
            price: req.body.price,
            max_discount: req.body.max_discount,
            product_group_id: req.body.product_group_id

            //
        };

        // Save Product in the database
        product.create(productModel)
            .then(data => {
                res.send(data);
                /* #swagger.responses[200] = {
                     description:   "Product registered successfully",
                     schema: { "$ref": "#/components/schemas/Product" }
                } */
            })
            .catch(err => {
                // #swagger.responses[500] = { description: 'Some error occurred while creating the Product...' }
                next(new CustomError(
                    err.message || "Some error occurred while creating the Product.")
                );
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create a Product

};

// Retrieve all Product from the database.
exports.queryPage = (req, res, next) => {
    /*  #swagger.tags = ['Product']
       #swagger.description = 'Get all product as paginated.' */
    /*  #swagger.requestBody = {
                   required: true,
                   content: {
                       "application/json": {
                           schema: {
                               $ref: "#/components/schemas/ProductQuery"
                           }
                       }
                   }
               }
           */
    const {page, size, filter} = req.body;

    let condition = qg.prepareFilterCondition(filter);

    const {limit, offset} = getPagination(page, size);

    product.findAndCountAll({where: condition, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            /* #swagger.responses[200] = {
                 description:   "get product data as paginated",
                 schema: { "$ref": "#/components/schemas/ProductPaginationModel" }
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving product...' }
            next(new CustomError(err.message || "Some error occurred while retrieving product."));
        });
};

// Find a single Product with an id
exports.findOne = (req, res, next) => {
    /*  #swagger.tags = ['Product']
   #swagger.description = 'Get specific product.' */
    // #swagger.parameters['id'] = { description: 'product id', required:true, type: number}
    const id = req.params.id;

    product.findByPk(id)
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "Product has been founded",
                 schema: { "$ref": "#/components/schemas/Product" }
            } */
        })
        .catch(err => {
            // #swagger.responses[500] = { description: 'Error retrieving product...' }
            next(new CustomError(
                "Error retrieving User with id=" + id)
            );
        });
};

// Update a Product by the id in the request
exports.update = (req, res, next) => {
    /*  #swagger.tags = ['Product']
           #swagger.description = 'Update product.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Product"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;

        product.update(req.body, {
            fields: ['name', 'price', 'product_group_id'],
            where: {id: id}
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Product was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );
                // #swagger.responses[500] = { description: 'Error updating Product...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Update a Product Qr Code by the id in the request
exports.updateQrCode = async (req, res, next) => {
    /*  #swagger.tags = ['Product']
           #swagger.description = 'Update product.' */
    // #swagger.description = 'Get specific product.' */
    // #swagger.parameters['id'] = { description: 'product id', required:true, type: number}

    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;
        let _qrcode = await QRCode.toDataURL('http://www.google.com');
        console.log("şimdi burdayım");
        console.log(_qrcode);
        product.update({qrcode: _qrcode}, {
            where: {id: id}
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Product qr code was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Product qr code with id=${id}. Maybe Product was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );
                // #swagger.responses[500] = { description: 'Error updating Product qr code...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Delete a Product with the specified id in the request
exports.delete = (req, res, next) => {
    /*  #swagger.tags = ['Product']
        #swagger.description = 'Delete product.' */
    // #swagger.parameters['id'] = { description: 'product id', required:true, type: number}

    const id = req.params.id;

    product.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
                });
            }
        })
        .catch(err => {
            next(new CustomError(
                "Could not delete User with id=" + id)
            );
            // #swagger.responses[500] = { description: 'Could not delete Product...' }

        });
};

// Delete all Products from the database.
exports.deleteAll = (req, res, next) => {
    /*  #swagger.tags = ['Product']
        #swagger.description = 'Delete all product.' */
    product.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} products were deleted successfully!`});
        })
        .catch(err => {
            next(new CustomError(
                err.message || "Some error occurred while removing all products.")
            );
            // #swagger.responses[500] = { description: 'Some error occurred while removing all products...' }

        });
};


  