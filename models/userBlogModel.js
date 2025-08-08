const mongoose = require("mongoose");

// Define the schema
const userBlogSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // If you have a user model
        required: true,
        unique:true
    },
    restaurantName: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    foodImages: [{
        type: String // store file path
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
  }
  
);

const userBlog = mongoose.model("userBlog", userBlogSchema);

module.exports=userBlog;
