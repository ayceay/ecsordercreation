const express = require('express');
const router = express.Router();
const customerService = require('../service/customerService');
const jwtUtil = require('../security/jwt/jwt-util');
const {CUSTOMER_CREATE_VALIDATOR} = require("../service/validation/customer-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new Product
router.post("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], CUSTOMER_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerService.create(req, res, next));
});

// Retrieve all Products
router.post("/queryPage", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
           "bearerAuth": []
   }] */
    return asyncHandler(customerService.queryPage(req, res, next));
});

// Retrieve a single product with id
router.get("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerService.findOne(req, res, next));
});

// Update a product with id
router.put("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], CUSTOMER_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerService.update(req, res, next))
});

// Delete a product with id
router.delete("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerService.delete(req, res, next));
});

// Create a new product
router.delete("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerService.deleteAll(req, res, next));
});

module.exports = router;
