const express=require('express');
const path = require("path");
require('dotenv').config();

const connectDB = require('./config/db');

const userRoute=require('./routes/userRoute');


// Connect to DB
connectDB();

const app=express();

app.use(express.json());

app.use('/api',userRoute)

// app.use("/images", express.static(path.join("public/images")));
app.use('/public', express.static('public'))

//app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`server started at ${PORT}`));

