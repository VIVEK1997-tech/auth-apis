// const express=require('express');

// const router = express.Router();

// const {registerValidation}=require('../utils/userValidator')


// // const {uploadFile}=require('../controllers/uploadFile')

// const {userRegister}=require('../controllers/userController')

// router.post("/register",registerValidation,userRegister);



// module.exports=router;


// alternate code


const express = require('express');
const router = express.Router();
const { userRegister } = require('../controllers/userController');
const { upload } = require('../middlewares/user'); // multer
const { registerValidation } = require('../utils/userValidator'); // express-validator
const validate = require('../middlewares/validate'); // custom validationResult handler
const validateImage = require('../middlewares/validateImage'); // custom image checks

router.post(
  '/register',
  upload.single('image'),         // ✅ Handle image upload FIRST
  registerValidation,             // ✅ Validate body fields
  validate,                       // ✅ Check express-validator errors
  validateImage,                  // ✅ Check if image is present and correct  type
  userRegister                    // ✅ Now call controller
);

module.exports = router;




