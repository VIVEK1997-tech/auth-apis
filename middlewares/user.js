const multer= require('multer')

const path=require('path')

const storage=multer.diskStorage({

    destination:function(req,file,cb){
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename:function(req,file,cb){
        const uniqueName = `${Date.now()}-${file.originalname}`
        cb(null,uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Invalid file type"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max
});

module.exports={upload};