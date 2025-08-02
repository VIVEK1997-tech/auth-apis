const mongoose = require("mongoose");

// Define the schema
const resetTokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      ref:'User'
    },
    token: {
      type: String,
      required: true,
      unique: true,
     
    },
}
);

const ResetToken = mongoose.model("PasswordResetToken", resetTokenSchema);

module.exports=ResetToken;
