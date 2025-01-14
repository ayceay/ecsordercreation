const express = require('express');
const router = express.Router();
const orderService = require('../service/orderService');
const jwtUtil = require('../security/jwt/jwt-util');
const {ORDER_CREATE_VALIDATOR} = require("../service/validation/order-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new Product Group
router.post("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], ORDER_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
                  "bearerAuth": []
          }] */
    return asyncHandler(orderService.create(req, res, next));
});

// Retrieve all Product Group as page
router.post("/queryPage", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(orderService.queryPage(req, res, next));
});

// Retrieve all Product Group
router.get("/findAll", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(orderService.findAll(req, res, next));
});

// Retrieve a single product group with id
router.get("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(orderService.findOne(req, res, next));
});

// Update a product group with id
router.put("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], ORDER_CREATE_VALIDATOR, (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(orderService.update(req, res, next));
});

// Delete a product group with id
router.delete("/:id", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(orderService.delete(req, res, next));
});

// Create a new product group
router.delete("/", [jwtUtil.authenticateToken, jwtUtil.checkRole([Roles.ADMIN])], (req, res, next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(orderService.deleteAll(req, res, next));
});

module.exports = router;
