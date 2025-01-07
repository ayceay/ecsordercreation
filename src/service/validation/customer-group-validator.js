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
        .bail(),
    body('max_discount')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Product max discount can not be empty!')
        .bail()
];


exports.CUSTOMER_GROUP_CREATE_VALIDATOR = customerGroupCreateValidator