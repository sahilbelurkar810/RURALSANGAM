const express = require('express');
const { register, login, logout, getUser, getAllUsers} = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getUser/:id',  getUser); 
router.get('/getAllUsers', getAllUsers);

module.exports = router;