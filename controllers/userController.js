const Blog=require('../models/userBlogModel');
const User = require('../models/userModel');
const blackList=require('../models/blackListModel');
const resetPass = require('../models/resetPassModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const jwt=require('jsonwebtoken');
const mailer=require('../utils/mailer');
const {generateAccessToken,generateRefreshToken}=require('../utils/tokenUtils');
const {deleteFile}=require('../utils/deleteFile');
const { validationResult } = require('express-validator');


const userRegister = async (req, res) => {
  try {
    const { name, email, mobile, password,role } = req.body;

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
      role:role || 'user', // use 'user' if role not provided
      password: hashPassword,
      userImage: imagePath
    });
    
    const userData = await newUser.save();

     const verifyUrl = `http://localhost:5000/mail-verification?id=${userData._id}`;
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
          console.log("404 not found ")
        // return res.render("404 not found")
      }

      const userData=await User.findOne({_id:req.query.id});

      if(userData){

        await User.findByIdAndUpdate({_id:req.query.id},{

            $set:{is_verified:1}

        })

        // return res.render('mail-verification',{message:'mail have been verified successfully'})
        return res.status(200).json({message:'mail have been verifed successfully'})

      }
      else{
        // return res.render('mail-verification',{message:'user not found'})

        return res.status(404).json({message:'user not found'})
      }

  }
  catch(err){
      console.log(err.message);
      return res.render('404');
  }
};

const verifyMailHandler=async(req,res)=>{

  try{

      const error=validationResult(req);

      if(!error.isEmpty()){

          console.log('user not found')

          return res.json({
            message:"email is required"
          })

      }
      const {email}=req.body
     const userData=await User.findOne({email})
      if(!userData){
        return res.status(400).json({
          message:'not a valid email'
        })
      }

      if(userData.is_verified==1){
        return res.status(400).json({
          message:'email is already verified'
        })
      }

        const verifyUrl = `http://localhost:5000/mail-verification?id=${userData._id}`;
    const html = `<h2>Verify your email</h2><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`;

  

    mailer.sendMail(userData.email,'Mail-verification',html);

    res.status(201).json({
      message: 'verification link send to your mail ,please check in mail box',
     
    });

  }
  catch(err){
       console.log(err.message);
      return res.render('<p>some thing went wrong</>');
  }
};

const forgotPasswordHandler= async(req,res)=>{

      try {

          const error=validationResult(req);

            if (!error.isEmpty()) {
            
                return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error.array().map(err => ({
                  field: err.param,
                  message: err.msg
                }))
              });
            }
            const {email}=req.body;

            const userData=await User.findOne({email})

            if (!userData) {
              return res.status(404).json({
                success: false,
                message: "User not found with this email"
              });
            }
            const randomString=randomstring.generate();
            
            const resetURl=`http://localhost:5000/reset-password?token=${randomString}`

            const html = `<h2>You requested a password reset.<p>Click <a href="${resetURl}">here</a> to reset password.</p></h2>`

            await resetPass.deleteMany({user_id:userData._id});

            const passwordReset=new resetPass({
              user_id:userData._id,
              token:randomString
            });

            await passwordReset.save();

             mailer.sendMail(userData.email,'reset-password',html);

             return res.status(201).json({
              success:true,
              message:'reset link to your mail, please check'
             });

      }
      catch (error) {
    console.error("forgot password error:", error.message);
};


};

const resetPassword=async(req,res)=>{
  try{
      if(req.query.token==undefined){
        return res.render('404');
      }
      const resetData= await resetPass.findOne({token:req.query.token});
        if(!resetData){
          return res.render('404');
        }

        return res.render('reset-password',{resetData});

  }
   catch (error) {
    console.error("Reset password error:", error.message);
};

};

const updatePassword=async(req,res)=>{
 try{

      const { password, c_password, user_id } = req.body;

      const resetData=await resetPass.findOne({user_id});

        if (password !== c_password) {

          return res.render('reset-password',{resetData,error:'password do not match'});

        }
        const hashedpassword=await bcrypt.hash(c_password,10);

        await User.findByIdAndUpdate({_id:user_id},{
          $set:{
           password:hashedpassword 
          }
        })
        await resetPass.deleteMany({user_id})

        return res.redirect('/reset-success');



  }
 catch(error){

    res.status(400).json({
      error:error.message
    })
 }
};

const resetSuccess=async(req,res)=>{

  try{

      return res.render('resetSuccess');

  }
  catch(error){

      return res.render('404')
  }
};


const loginHandler=async(req,res)=>{
  try{
        const error=validationResult(req);
        if(!error.isEmpty()){
          return res.status(401).json({
            success:false,
            msg:"valid user email and password is required"
          })
        }
          
        const {email,password}=req.body;

        const userData = await User.findOne({email});
            // console.log(userData.password);
        if(!userData){
          return res.status(401).json({
            success:false,
            msg:'user is not found!'
          })
        }

          // console.log("User password from DB:", userData.password);
          // console.log("Password from input:", password);


        const matchPassword= await bcrypt.compare(password,userData.password);

        if(!matchPassword){
          return res.status(401).json({
            success:false,

            msg:'email or password is incorrect'

          })
        }

        if(userData.is_verified==0){
          return res.status(401).json({
            success:false,
            msg:'please verify your account'
          })
        }

        const accesstoken= await generateAccessToken(userData);
        const refreshtoken=await generateRefreshToken(userData);
        return res.status(201).json({
          success:true,
          msg:'user login successfully ',
          userData:userData,
          accesstoken:accesstoken,
          refreshtoken:refreshtoken,
          tokenType:'Bearer',
        })


  }
  catch(error){

    return res.status(400).json({
      success:false,
      msg:error,
      error:error.message
    })
  }
};

const profileHandler=async(req,res)=>{
    try{
          const userData=req.user.user;
            
          return res.status(201).json({
            success:true,
            msg:"user Profile Data",
            data:userData
          });


    }
    catch(error){
      return res.status(400).json({
      success:false,
      msg:error.message  
    })
    }
};

const updateProfile=async(req,res)=>{

  try{
        const error=validationResult(req);
        if(!error.isEmpty()){
          return res.status(401).json({
            success:false,
            msg:error,
            error:error.message
          })
        }
        const userId=req.user.user._id;
            console.log(userId);
        const {name,mobile}=req.body;

        const data={
          name,
          mobile
        }

        if(req.file!==undefined){

          data.userImage="images/"+req.file.filename;

          const oldUser=await User.findOne({_id:userId});
          const oldImgPath=path.join(__dirname,'../public/'+oldUser.userImage);

          deleteFile(oldImgPath);
          
        }

        const userData=await User.findByIdAndUpdate({_id:userId},{
          $set:data
        },{new:true});


        return res.status(201).json({
          success:true,
          msg:"User updated successfully",
          data:userData
        })



  }
  catch(error){
    return res.status(400).json({
      success:false,
      msg:error,
      error:error.message
    })
  }

};

const refreshToken=async (req,res)=>{
  try{

        const userId=req.user.user._id;

          const userData=await User.findOne({_id:userId});

        const accesstoken=await generateAccessToken(userData);
        const refreshtoken=await generateRefreshToken(userData);


        return res.status(201).json({
          success:true,
          msg:"User token is refreshed",
          accesstoken:accesstoken,
          refreshtoken:refreshtoken,
          tokenType:"Bearer"
        })

  }
  catch(error){
     return res.status(400).json({
      success:false,
      msg:error,
      error:error.message
    })
  }
};

const logoutHandler=async(req,res)=>{
  try{
     const  Token=req.headers["authorization"];
    
     const  token = Token.split(' ');
    const bearertoken=token[1];

    const blacklist=new blackList({
        token:bearertoken
    });

    await blacklist.save();

    return res.status(201).json({
      success:true,
      msg:"you are logged out!"
    });

  }
  catch(error){
      return res.status(400).json({
      success:false,
      msg:error,
      error:error.message
    })
  }
};

const userBlogHandler=async(req,res)=>{

    try {
        const { restaurantName, review } = req.body;
        const foodImages = req.files ? req.files.map(file => "public/images/" + file.filename) : [];

        const userId=req.user.user._id;
        const existingBlog = await Blog.findOne({ user:userId });
        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: "You already have a blog. Please update it instead."
            });
        }

        const blog = await Blog.create({
            user: req.user.user._id, // assuming authentication middleware sets req.user
            restaurantName,
            review,
            foodImages
        });

        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        console.error("Blog creation error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

};

const updateBlog=async(req,res)=>{
  try {
        const userId = req.user.user._id;
        const foodImage = req.file ? "public/images/" + req.file.filename : null;
        const { restaurantName, review } = req.body;

        const blog = await Blog.findOneAndUpdate(
            { user:userId },
            { restaurantName,review,foodImage },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "No blog found for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const getAllBlogs=async(req,res)=>{
     try {

            const page=parseInt(req.query.page);
            const limit=4;
            totalBlogs=await Blog.countDocuments();

            totalPages=Math.ceil(totalBlogs/limit);


            if(page>totalPages){
             return  res.status(401).json({message:'Page not found'})
            }

        const blogs = await Blog.find()
            .populate("user", "name email") // Only essential user details
            .sort({ createdAt: -1 }) // Latest first
            .skip((page-1)*limit)
            .exec();

        if (!blogs.length) {
            return res.status(404).json({
                success: false,
                message: "No blog posts found."
            });
        }

        res.status(200).json({
              success: true,
              currentPage: page,
              totalPages:totalPages,
              data: blogs
        });

    } 
    catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


module.exports = { userRegister,mailVerification,verifyMailHandler,forgotPasswordHandler,resetPassword,updatePassword,resetSuccess,loginHandler,profileHandler,updateProfile,refreshToken,logoutHandler,userBlogHandler,updateBlog,getAllBlogs };
