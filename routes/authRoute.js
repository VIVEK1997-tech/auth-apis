const express = require('express');

const router = express.Router();

const { mailVerification,resetPassword,updatePassword,resetSuccess } = require('../controllers/userController');

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({extended:true}));

router.get('/mail-verification',mailVerification);

router.get('/reset-password',resetPassword);

router.post('/reset-password',updatePassword);

router.get('/reset-success',resetSuccess);

module.exports=router;