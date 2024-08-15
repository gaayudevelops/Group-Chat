const express = require('express');
const groupController = require('../controllers/group');
const userauthentication = require('../middleware/auth')
const router = express.Router();

// Create Group=> POST
router.post('/create-group', userauthentication.authenticate, groupController.postCreateGroup);

// Get Groups => GET
router.get('/get-groups', userauthentication.authenticate, groupController.getGroups);

// Add User to Group => POST
router.post('/add-user-to-group', userauthentication.authenticate, groupController.postAddUsertoGroup);

// Remove User from Group => POST
router.post('/remove-user-from-group', userauthentication.authenticate, groupController.postRemoveUserFromGroup);

module.exports = router;
