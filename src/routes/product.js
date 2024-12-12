const express = require('express');
const router = express.Router();
const productService = require('../service/productService');
const jwtUtil = require('../security/jwt/jwt-util');
const {PRODUCT_CREATE_VALIDATOR} = require("../service/validation/product-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new Product
router.post("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], PRODUCT_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(productService.create(req, res, next));
});

// Retrieve all Products
router.post("/queryPage", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
           "bearerAuth": []
   }] */
    return asyncHandler(productService.queryPage(req, res, next));
});

// Retrieve a single product with id
router.get("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(productService.findOne(req, res, next));
});

// Update a product with id
router.put("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], PRODUCT_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(productService.update(req, res, next))
});

//update product qrcode
router.put("/qrcode/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(productService.updateQrCode(req, res, next));
});

// Delete a product with id
router.delete("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(productService.delete(req, res, next));
});

// Create a new product
router.delete("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(productService.deleteAll(req, res, next));
});

module.exports = router;
