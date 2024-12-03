const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const jwtUtil = require('../security/jwt/jwt-util');
const {USER_CREATE_VALIDATOR,USER_PASSWORD_CHANGE_VALIDATOR} = require("../service/validation/user-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


/* GET users listing. */
router.post('/login', userService.login);

// Create a new User
router.post("/", jwtUtil.authenticateToken, USER_CREATE_VALIDATOR, asyncHandler(userService.create));

//user password change
router.post("/password-change", jwtUtil.authenticateToken, USER_PASSWORD_CHANGE_VALIDATOR, asyncHandler(userService.updatePassword));

// Retrieve all Users
router.post("/queryPage", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], asyncHandler(userService.findAll));

// Retrieve a single User with id
router.get("/:id", jwtUtil.authenticateToken, asyncHandler(userService.findOne));

// Update a User with id
router.put("/:id", jwtUtil.authenticateToken, USER_CREATE_VALIDATOR, asyncHandler(userService.update));

// Delete a User with id
router.delete("/:id", jwtUtil.authenticateToken, asyncHandler(userService.delete));

// Create a new User
router.delete("/", jwtUtil.authenticateToken, asyncHandler(userService.deleteAll));

module.exports = router;
