const { body } = require('express-validator');

const userCreateValidator = [
    body('name', 'name is invalid, it does not Empty').not().isEmpty(),
    body('name', 'The name minimum password length is 6 characters').isLength({min: 2}),
    body('surname', 'surname is invalid, it does not Empty').not().isEmpty(),
    body('surname', 'The surname minimum password length is 6 characters').isLength({min: 2}),
    body('username', 'username is invalid, it does not Empty').not().isEmpty(),
    body('username', 'The username minimum password length is 6 characters').isLength({min: 2}),
];


exports.USER_CREATE_VALIDATOR = userCreateValidator