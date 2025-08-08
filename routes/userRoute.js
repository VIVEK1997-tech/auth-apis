
const express = require('express');
const router = express.Router();
const { userRegister ,verifyMailHandler,forgotPasswordHandler,loginHandler,profileHandler,updateProfile,refreshToken,logoutHandler,userBlogHandler,updateBlog} = require('../controllers/userController');
const { upload } = require('../middlewares/user');
const { registerValidation,sendMailValidator,resetPasswordValidator,loginValidator, updateProfileValidator } = require('../utils/userValidator'); 
const validate = require('../middlewares/validate'); // custom validationResult handler
const validateImage = require('../middlewares/validateImage'); // custom image checks
const { authenticate } = require('../middlewares/auth');

router.post(
  '/register',
  upload.single('image'),         // ✅ Handle image upload FIRST
  registerValidation,             // ✅ Validate body fields
  validate,                       // ✅ Check express-validator errors
  validateImage,                  // ✅ Check if image is present and correct  type
  userRegister                    // ✅ Now call controller
);

router.post('/verify-mail',sendMailValidator,verifyMailHandler);

router.post('/forgot-password',resetPasswordValidator,forgotPasswordHandler);

router.post('/login',loginValidator,loginHandler);


// authenticated Routes

router.get('/profile',authenticate,profileHandler);

router.post('/update-profile',authenticate,upload.single('image'),updateProfileValidator,updateProfile);

router.get('/refresh-token',authenticate,refreshToken);

router.get('/logout',authenticate,logoutHandler);

router.post('/blog',authenticate,upload.array('images', 5),userBlogHandler);

router.post('/update-blog',authenticate,upload.single('image'),updateBlog);

module.exports = router;




