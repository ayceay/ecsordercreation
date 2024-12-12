const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const jwtUtil = require('../security/jwt/jwt-util');
const {USER_CREATE_VALIDATOR,USER_PASSWORD_CHANGE_VALIDATOR} = require("../service/validation/user-validator");
const {asyncHandler} = require("../exception/handler/asyncHandler");
const {Roles} = require("../dto/user.roles")


// Create a new User
router.post("/", jwtUtil.authenticateToken, USER_CREATE_VALIDATOR, (req,res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.create(req, res,next));
});

/* GET users listing. */
router.post('/login', userService.login);

//user password change
router.post("/password-change", jwtUtil.authenticateToken, USER_PASSWORD_CHANGE_VALIDATOR, (req,res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.updatePassword(req, res,next));
});

// Retrieve all Users
router.post("/queryPage", [jwtUtil.authenticateToken,jwtUtil.checkRole([Roles.ADMIN])], (req,res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.findAll(req, res,next));
});

// Retrieve a single User with id
router.get("/:id", jwtUtil.authenticateToken, (req,res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.findOne(req, res,next));
});

// Update a User with id
router.put("/:id", jwtUtil.authenticateToken, USER_CREATE_VALIDATOR, (req,res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.update(req, res,next));
});

// Delete a User with id
router.delete("/:id", jwtUtil.authenticateToken, (req, res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.delete(req, res,next));
});

// Create a new User
router.delete("/", jwtUtil.authenticateToken, (req,res,next) => {
    /* #swagger.security = [{
              "bearerAuth": []
      }] */
    return asyncHandler(userService.deleteAll(req,res,next));
});

module.exports = router;
