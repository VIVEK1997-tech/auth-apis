const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile:{
      type:Number,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
     role: {
    type: String,
    enum: ['user', 'chef', 'admin'], // ✅ only allowed roles
    default: 'user' // default is normal user
    },
    is_verified: {
      type: Number,
      default: 0,//1 for when verifed
    },
    userImage: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports=User;
