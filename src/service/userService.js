const db = require("../dto");
const jwt = require('jsonwebtoken');
const config = require("../common/config");
const qg = require("../query-generator/query-generator-util");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");
const ClientError = require("../exception/clientError");
const ForbiddenError = require("../exception/forbiddenError");
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

// Create and Save a new Tutorial
exports.create = async (req, res, next) => {
    /*  #swagger.tags = ['User']
           #swagger.description = 'Create new user.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        // in case request params meet the validation criteria
        const pwd = req.body.password ? req.body.password : '123';
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(pwd, salt);
        console.log(hashedPassword);
        const user = {

            changed_by: '-',
            created_at: Date.now,
            updated_at: null,
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: hashedPassword
            //
        };

        // Save User in the database
        User.create(user)
            .then(data => {
                res.send(data);
                /* #swagger.responses[200] = {
                     description:   "User registered successfully",
                     schema: { "$ref": "#/components/schemas/User" }
                } */
            })
            .catch(err => {
                next(new CustomError(
                    err.message || "Some error occurred while creating the User.")
                );
                // #swagger.responses[500] = { description: 'Some error occurred while creating the User...' }
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create a user

};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res, next) => {
    /*  #swagger.tags = ['User']
       #swagger.description = 'Get all users as paginated.' */
    /*  #swagger.requestBody = {
                   required: true,
                   content: {
                       "application/json": {
                           schema: {
                               $ref: "#/components/schemas/Query"
                           }
                       }
                   }
               }
           */
    const {page, size, filter} = req.body;

    let condition = qg.prepareFilterCondition(filter);

    const {limit, offset} = getPagination(page, size);

    User.findAndCountAll({where: condition, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
            /* #swagger.responses[200] = {
                 description:   "get users data as paginated",
                 schema: { "$ref": "#/components/schemas/FindAll" }
            } */
        })
        .catch(err => {

            // #swagger.responses[500] = { description: 'Some error occurred while retrieving users...' }
            next(new CustomError(err.message || "Some error occurred while retrieving users."));
        });
};

// Find a single Tutorial with an id
exports.findOne = async (req, res, next) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Get specific user.' */
    // #swagger.parameters['id'] = { description: 'user id', required:true, type: number}

    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            res.send(data);
            /* #swagger.responses[200] = {
                 description:   "User has been founded",
                 schema: { "$ref": "#/components/schemas/User" }
            } */
        })
        .catch(err => {
            next(new CustomError(
                "Error retrieving User with id=" + id)
            );
        });
};

// Find a single Tutorial with an id
exports.login = async (req, res, next) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Login user.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Authentication"
                            }
                        }
                    }
                }
            */
    try {
        const {username, password} = req.body;
        User.findOne({
            where: {
                username: {
                    [Op.eq]: username,
                },
            }
        }).then(async data => {
            const passwordMatched = await bcrypt.compare(password, data.dataValues.password);
            if (!passwordMatched) {
                res.send("Username/Password is incorrect!");
            } else {
                const token = generateAccessToken({username: username});
                res.json(token);
            }
        })
            .catch(err => {
                next(new CustomError(
                    "Error retrieving User with username=" + username)
                );

                // #swagger.responses[500] = { description: 'Error retrieving User with username...' }

            });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res, next) => {
    /*  #swagger.tags = ['User']
           #swagger.description = 'Update new user.' */
    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User"
                            }
                        }
                    }
                }
            */
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const id = req.params.id;

        User.update(req.body, {
            fields: ['name', 'surname', 'username'],
            where: {id: id}
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "User was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating User with id=" + id)
                );

                // #swagger.responses[500] = { description: 'Error updating User...' }

            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Update a Tutorial by the id in the request
exports.updatePassword = async (req, res, next) => {
    /*  #swagger.tags = ['User']
           #swagger.description = 'Update user password.' */
    // #swagger.parameters['id'] = { description: 'user id', required:true, type: number}

    /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            "password": "password"
                        }
                    }
                }
            */
    const id = req.params.id;
    const {password} = req.body;
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        User.findByPk(id)
            .then(async data => {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                data.set({
                    password: hashedPassword
                });
                await data.save();
                res.send(data);
                /* #swagger.responses[200] = {
                     description:   "User password has been changed",
                     schema: { "$ref": "#/components/schemas/User" }
                } */
            })
            .catch(err => {
                next(new CustomError(
                    "Error updating password, id=" + id)
                );
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Delete a User with the specified id in the request
exports.delete = async (req, res, next) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Delete user.' */
    // #swagger.parameters['id'] = { description: 'user id', required:true, type: number}

    const id = req.params.id;

    User.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            next(new CustomError(
                "Could not delete User with id=" + id)
            );

            // #swagger.responses[500] = { description: 'Could not delete User...' }

        });
};

// Delete all Users from the database.
exports.deleteAll = async (req, res, next) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Delete all user.' */
    User.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} Users were deleted successfully!`});
        })
        .catch(err => {
            next(new CustomError(
                err.message || "Some error occurred while removing all Users.")
            );
            // #swagger.responses[500] = { description: 'Some error occurred while removing all Users...' }

        });
};

// Recover a user if present.
exports.getUser = async username => {
    return await User.findOne({
        where: {
            username: {
                [Op.eq]: username,
            },
        }
    })
}

// // find all published User
// exports.findAllPublished = (req, res) => {
//     const { page, size } = req.query;
//     const { limit, offset } = getPagination(page, size);

//     User.findAndCountAll({ where: { published: true }, limit, offset })
//         .then(data => {
//             const response = getPagingData(data, page, limit);
//             res.send(response);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving users."
//             });
//         });
// };

function generateAccessToken(user) {
    return jwt.sign({userId: user.id, username: user.username, role: user.role},
        config.jwt.secret,
        {
            expiresIn: '24h',
            notBefore: '0', // Cannot use before now, can be configured to be deferred.
            algorithm: 'HS256',
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        });
}

  