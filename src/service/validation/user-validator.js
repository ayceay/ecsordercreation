const { body } = require('express-validator');

const userCreateValidator = [
    body('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail(),
    body('surname')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User surname can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail(),
    body('username')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('username can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail(),
];


exports.USER_CREATE_VALIDATOR = userCreateValidator