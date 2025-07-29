const express = require('express');
const router = express.Router();
const { mailVerification } = require('../controllers/userController');

router.get('/mail-verification',mailVerification);

module.exports=router;