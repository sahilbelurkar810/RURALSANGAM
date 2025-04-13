const express = require('express');
const { register, login, logout, getUser, getAllUsers,deleteUser} = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');
const {getCurrentUser} = require('../controllers/useController.js')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getUser/:id',  getUser); 
router.get('/getAllUsers', getAllUsers);
router.get('/me', protect, getCurrentUser); 
router.delete('/deleteUser/:id', deleteUser); 
module.exports = router;