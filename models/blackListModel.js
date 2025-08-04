const mongoose = require("mongoose");

// Define the schema
const blaclListSchema = new mongoose.Schema(
  {
  
    token: {
      type: String,
      required: true,
      unique: true,
     
    },
}
);

const BlackListToken = mongoose.model("BlackListToken", blaclListSchema);

module.exports=BlackListToken;