const {body} = require('express-validator');

const customerGroupCreateValidator = [
    body('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Product group name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail()
];


exports.CUSTOMER_GROUP_CREATE_VALIDATOR = customerGroupCreateValidator