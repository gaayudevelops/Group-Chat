const express = require('express');
const resetpasswordController = require('../controllers/reset-password');
const router = express.Router();

router.put('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword) 

router.put('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;