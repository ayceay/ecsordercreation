const { body } = require('express-validator');

const productGroupCreateValidator = [
    body('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail()
];


exports.PRODUCT_GROUP_CREATE_VALIDATOR = productGroupCreateValidator