const db = require("../dto");
const qg = require("../query-generator/query-generator-util");
const order = db.order;
const order_detail = db.order_detail;
const {validationResult} = require("express-validator");
const CustomError = require("../exception/customError");
const databaseIndex = require("../dto/index");


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

// Create and Save a new Order
exports.create = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
           #swagger.description = 'Create new order.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Order"
                            }
                        }
                    }
                }
            */
    // First, we start a transaction from your connection and save it into a variable
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const {orderDetails} = req.body;

        // Validate input
        if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
            return res.status(400).json({ message: "orderDetails must be a non-empty array" });
        }

        // in case request params meet the validation criteria
        const orderModel = {

            changed_by: '-',
            created_at: Date.now,
            updated_at: null,
            name: req.body.name
            //
        };
        try {
            await databaseIndex.sequelize.transaction(async t => {
                // Save order in the database
                const _order = await order.create(orderModel, {transaction: t});

                if (orderDetails){
                    const orderDetailsWithOrderId = orderDetails.map((orderDetail) => ({
                        ...orderDetail,
                        changed_by: '-',
                        created_at: Date.now,
                        updated_at: null,
                        order_id: _order.id,
                    }));

                    await order_detail.bulkCreate(orderDetailsWithOrderId, {transaction: t});
                }
                    /* #swagger.responses[200] = {
                                    description:   "User registered successfully",
                                    schema: { "$ref": "#/components/schemas/Order" }
                               } */
                res.send(_order);
            });
        } catch (err) {
            // #swagger.responses[500] = { description: 'Some error occurred while creating the Order...' }
            next(new CustomError(
                err.message || "Some error occurred while creating the Order."));
        }

    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create an Order

};

// Retrieve all Order as paginated from the database.
exports.queryPage = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
       #swagger.description = 'Get all order as paginated.' */
    /*  #swagger.requestBody = {
                   required: true,
                   content: {
                       "application/json": {
                           schema: {
                               $ref: "#/components/schemas/OrderQuery"
                           }
                       }
                   }
               }
           */
    const {page, size, filter} = req.body;

    let condition = qg.prepareFilterCondition(filter);

    const {limit, offset} = getPagination(page, size);

    order.findAndCountAll({where: condition, limit, offset}, {include: [{model: order_detail, as: "orderDetails", include: [{model: product, as: "orderDetails"}]}]})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            /* #swagger.responses[200] = {
                 description:   "get orders data as paginated",
                 schema: { "$ref": "#/components/schemas/OrderPaginationModel" }
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving orders...' }
            next(new CustomError(err.message || "Some error occurred while retrieving orders."));
        });
};

// Retrieve all Order from the database.
exports.findAll = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
       #swagger.description = 'Get all order.' */


    order.findAll()
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "get all order data ",
                 schema: [{ "$ref": "#/components/schemas/Order" }]
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving orders...' }
            next(new CustomError(err.message || "Some error occurred while retrieving orders."));
        });
};

// Find a single Order with an id
exports.findOne = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
   #swagger.description = 'Get specific order.' */
    // #swagger.parameters['id'] = { description: 'order id', required:true, type: number}
    const id = req.params.id;
    order.findByPk(id, {attributes: ['name']})
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "Order has been founded",
                 schema: { "$ref": "#/components/schemas/Order" }
            } */
        })
        .catch(err => {
            // #swagger.responses[500] = { description: 'Error retrieving order...' }
            next(new CustomError(
                "Error retrieving User with id=" + id)
            );
        });
};

// Update an Order by the id in the request
exports.update = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
           #swagger.description = 'Update new order.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Order"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;

        order.update(req.body, {
            fields: ['name'],
            where: {id: id}
        })
            .then(num => {
                if (num === 1) {
                    res.send({
                        message: "Order was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );
                // #swagger.responses[500] = { description: 'Error updating Order...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Delete an Order with the specified id in the request
exports.delete = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
        #swagger.description = 'Delete order.' */
    // #swagger.parameters['id'] = { description: 'order id', required:true, type: number}

    const id = req.params.id;

    order.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Order was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
                });
            }
        })
        .catch(err => {
            next(new CustomError(
                "Could not delete User with id=" + id)
            );
            // #swagger.responses[500] = { description: 'Could not delete Order...' }

        });
};

// Delete all Orders from the database.
exports.deleteAll = async (req, res, next) => {
    /*  #swagger.tags = ['Order']
        #swagger.description = 'Delete all order.' */
    order.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} orders were deleted successfully!`});
        })
        .catch(err => {
            next(new CustomError(
                err.message || "Some error occurred while removing all orders.")
            );
            // #swagger.responses[500] = { description: 'Some error occurred while removing all orders...' }

        });
};


  