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
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number")
        .bail(),
    body('unit')
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Unit is required")
        .isIn(["k", "m", "p"])
        .withMessage("Unit must be either 'kg' or 'meter'")
        .bail(),
    body('max_discount')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Product max discount can not be empty!')
        .isFloat({ min: 0 })
        .withMessage("Max discount must be a positive number")
        .bail()

];


exports.PRODUCT_CREATE_VALIDATOR = productCreateValidator