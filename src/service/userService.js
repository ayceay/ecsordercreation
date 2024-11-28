const db = require("../dto");
const jwt = require('jsonwebtoken');
const qg = require("../query-generator/query-generator-util");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");
const saltRounds = 10; // Typically a value between 10 and 12

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
exports.create = async (req, res) => {
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
                // #swagger.responses[500] = { description: 'Some error occurred while creating the User...' }
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
    } else {
        res.status(422).json({errors: errors.array()});
    }


    // Create a user

};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
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
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
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
            res.status(500).send({
                // #swagger.responses[500] = { description: 'Error retrieving User...' }
                message: "Error retrieving User with id=" + id
            });
        });
};

// Find a single Tutorial with an id
exports.login = async (req, res) => {
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
                res.status(500).send({
                    message: "Error retrieving User with username=" + username
                });
                // #swagger.responses[500] = { description: 'Error retrieving User with username...' }

            });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
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
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
            // #swagger.responses[500] = { description: 'Error updating User...' }

        });
    } else {
        res.status(422).json({errors: errors.array()});
    }
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
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
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
            // #swagger.responses[500] = { description: 'Could not delete User...' }

        });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.description = 'Delete all user.' */
    User.destroy({
        where: {}, truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} Users were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Users."
            });
            // #swagger.responses[500] = { description: 'Some error occurred while removing all Users...' }

        });
};

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

function generateAccessToken(username) {
    return jwt.sign(username, process.env.JWT_SECRET, {expiresIn: '24h'});
}

async function encryptPassword(password) {
    let hashedPwd;
    await bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            throw err;
        }

// Hashing successful, 'hash' contains the hashed password
        console.log('Hashed password:', hash);
        hashedPwd = hash;
    });
    return  hashedPwd;
}
  