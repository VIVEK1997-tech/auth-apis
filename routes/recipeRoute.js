const express = require('express');

const router = express.Router();
const {createRecipe}=require('../controllers/recipeController');
const authorizeRoles = require('../middlewares/roleCheck');
const { authenticate } = require('../middlewares/auth');
const { upload } = require('../middlewares/user');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({extended:true}));

router.post('/recipes',authenticate,authorizeRoles("admin", "chef"),
  upload.single('image') ,createRecipe);

module.exports=router;