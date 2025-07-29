// const User=require('../models/userModel')

// const bcrypt=require('bcryptjs')

// const fs = require('fs');
// const path = require('path');


// const {upload}=require('../middlewares/user');

// const {validationResult}=require('express-validator');
        

// const  userRegister = async(req,res)=>
// {


//     try {
      
        

//          upload.single('image')(req, res, async (err) => {
//       if (err) return res.status(500).json({ message: "Image upload failed", error: err.message });

//           const error=validationResult(req);
//           if(!error.isEmpty()){
//             res.status(400).json({
//               success:false,
//               msg:'Error',
//               errors:error.array()
//             })
//           }
//        const { name, email, mobile, password } = req.body;

//       const userExists = await User.findOne({ email });
//       if (userExists) {
//         // Optional: delete the uploaded file if user already exists
//         if (req.file) {
//           fs.unlink(path.join(__dirname, '../public/images/', req.file.filename), (err) => {
//             if (err) console.error("Failed to delete unused image:", err);
//           });
//         }

//         return res.status(400).json({ message: "User already exists" });
//       }

//       if (!req.file) return res.status(400).json({ message: "Image is required" });

               

//         const  hashPassword= await bcrypt.hash(password,10);

//         const imagePath = req.file ? '/images/' + req.file.filename : null;

//         if (!imagePath) {
//         return res.status(400).json({ message: "Image is required" });
//         }

//         const newUser= new User({
//             name,
//             email,
//             mobile,
//             password:hashPassword,
//             userImage:imagePath
//         })

        

//         const userData= await newUser.save();

//         res.status(200).json({
//             message:'user registered successfully',
//             user:userData
//         });
//     });
//     }

//     catch (error) {
//   console.error(error); // 👈 This will show the real issue in your terminal
//   return res.status(400).json({
//     message: "user reg is failed",
//     error: error.message // Optional: send the error message to frontend too
//   });
//     }
// }


// module.exports={userRegister};


// alternate code

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const mailer=require('../utils/mailer')

const userRegister = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      // Delete uploaded image if email already exists
      if (req.file) {
        fs.unlink(path.join(__dirname, '../public/images/', req.file.filename), (err) => {
          if (err) console.error("Failed to delete unused image:", err);
        });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const imagePath = req.file ? '/images/' + req.file.filename : null;

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashPassword,
      userImage: imagePath
    });
    
    const userData = await newUser.save();

     const verifyUrl = `http://localhost:5000/mail-verification?id='+userData._id+'`;
    const html = `<h2>Verify your email</h2><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`;

    // const msg=`Hii ${name}, please <a href='verifyUrl'>verify</a> your mail`

    mailer.sendMail(email,'Mail-verification',html);

    res.status(201).json({
      message: 'User registered successfully',
      user: userData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User registration failed", error: error.message });
  }
};

const mailVerification= async(req,res)=>{
  try{
      if(req.query.id==undefined){

        return res.render("404 not found")
      }

      const userData=await User.findOne({_id:req.query.id});

      if(userData){

        await User.findByIdAndUpdate({_id:req.query.id},{

            $set:{is_verified:1}

        })

        return res.render('mail-verification',{message:'mail have been verified successfully'})

      }
      else{
        return res.render('mail-verification',{message:'user not found'})
      }

  }
  catch(err){
      console.log(err.message);
      return res.render('404');
  }
}




module.exports = { userRegister,mailVerification };
