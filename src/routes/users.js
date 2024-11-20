var express = require('express');
var router = express.Router();
const userService = require('../service/userService');
const jwtUtil = require('../security/jwt/jwt-util')


/* GET users listing. */
router.post('/login', userService.login);

// Create a new User
router.post("/", jwtUtil.authenticateToken, userService.create);

// Retrieve all Users
router.get("/", jwtUtil.authenticateToken, userService.findAll);

// Retrieve a single User with id
router.get("/:id", jwtUtil.authenticateToken, userService.findOne);

// Update a User with id
router.put("/:id", jwtUtil.authenticateToken, userService.update);

// Delete a User with id
router.delete("/:id", jwtUtil.authenticateToken, userService.delete);

// Create a new User
router.delete("/", jwtUtil.authenticateToken, userService.deleteAll);

module.exports = router;
