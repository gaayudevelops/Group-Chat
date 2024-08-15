const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const userauthentication = require('../middleware/auth')
const router = express.Router();

// Sign up => POST
router.post('/signup', userController.postSignUp);

// Login => POST
router.post('/login', userController.postLogin);

// Get all users => GET
router.get('/get-users', userauthentication.authenticate, userController.getAllUsers);

// Get a single user => GET
router.get('/get-user', userauthentication.authenticate, userController.getSingleUser);

module.exports = router;

