const express = require('express');
const router = express.Router();
const customerGroupService = require('../service/customerGroupService');
const jwtUtil = require('../security/jwt/jwt-util');
const {CUSTOMER_GROUP_CREATE_VALIDATOR} = require("../service/validation/customer-group-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new Product Group
router.post("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], CUSTOMER_GROUP_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
                  "bearerAuth": []
          }] */
    return asyncHandler(customerGroupService.create(req, res, next));
});

// Retrieve all Product Group as page
router.post("/queryPage", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerGroupService.queryPage(req, res, next));
});

// Retrieve all Product Group
router.get("/findAll", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerGroupService.findAll(req, res, next));
});

// Retrieve a single product group with id
router.get("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerGroupService.findOne(req, res, next));
});

// Update a product group with id
router.put("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], CUSTOMER_GROUP_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerGroupService.update(req, res, next));
});

// Delete a product group with id
router.delete("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerGroupService.delete(req, res, next));
});

// Create a new product group
router.delete("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(customerGroupService.deleteAll(req, res, next));
});

module.exports = router;
