const express = require('express');
const router = express.Router();
const productGroupService = require('../service/productGroupService');
const jwtUtil = require('../security/jwt/jwt-util');
const {PRODUCT_GROUP_CREATE_VALIDATOR} = require("../service/validation/product-group-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new Product Group
router.post("/", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], PRODUCT_GROUP_CREATE_VALIDATOR, asyncHandler(productGroupService.create));

// Retrieve all Product Groups
router.post("/queryPage", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productGroupService.queryPage));

// Retrieve a single product group with id
router.get("/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productGroupService.findOne));

// Update a product group with id
router.put("/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], PRODUCT_GROUP_CREATE_VALIDATOR, asyncHandler(productGroupService.update));

// Delete a product group with id
router.delete("/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productGroupService.delete));

// Create a new product group
router.delete("/", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productGroupService.deleteAll));

module.exports = router;
