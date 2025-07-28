// middlewares/validateImage.js
const validateImage = (req, res, next) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: 'Error',
      errors: [{ msg: 'please upload an image jpeg|png|jpg', path: 'image', location: 'body' }]
    });
  }

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      msg: 'Error',
      errors: [{ msg: 'Invalid image format', path: 'image', location: 'body' }]
    });
  }

  next();
};

module.exports=validateImage;