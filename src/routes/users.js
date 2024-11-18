var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../dto/user');
const UserRepository = require('../repository/userRepository');
const databasePool = require('../database/databasePool');
const userRepository = new UserRepository(databasePool);


/* GET users listing. */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('username: ' + username + " password: " + password);
    const user = await userRepository.getByUsername(username);
    console.log(user);
    if (user.password != password) {
      res.send("Username/Password is incorrect!");
    } else {

      const token = generateAccessToken({ username: username });
      res.json(token);
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }

  // res.send('respond with a resource');
});

function generateAccessToken(username) {
  return jwt.sign(username, process.env.JWT_SECRET, { expiresIn: '1800s' });
}

module.exports = router;
