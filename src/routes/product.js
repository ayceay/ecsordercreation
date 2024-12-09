const express = require('express');
const router = express.Router();
const productService = require('../service/productService');
const jwtUtil = require('../security/jwt/jwt-util');
const {PRODUCT_CREATE_VALIDATOR} = require("../service/validation/product-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new Product
router.post("/", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], PRODUCT_CREATE_VALIDATOR, asyncHandler(productService.create));

// Retrieve all Products
router.post("/queryPage", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productService.queryPage));

// Retrieve a single product with id
router.get("/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productService.findOne));

// Update a product with id
router.put("/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], PRODUCT_CREATE_VALIDATOR, asyncHandler(productService.update));

//update product qrcode
router.put("/qrcode/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productService.updateQrCode));

// Delete a product with id
router.delete("/:id", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productService.delete));

// Create a new product
router.delete("/", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(productService.deleteAll));

module.exports = router;
