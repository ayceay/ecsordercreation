const { body } = require('express-validator');

const productCreateValidator = [
    body('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Product name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail(),
    body('price')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Product price can not be empty!')
        .bail(),
    body('max_discount')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Product max discount can not be empty!')
        .bail()

];


exports.PRODUCT_CREATE_VALIDATOR = productCreateValidator