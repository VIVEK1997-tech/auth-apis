const jwt=require('jsonwebtoken');
const blacklist=require('../models/blackListModel')
const authenticate=(req,res,next)=>{


    // console.log("Request headers:", req.headers);
    const authHeader = req.headers?.authorization;
        
    if(!authHeader ){
            return res.status(401).json({ success: false, msg: 'No token provided' })
    }
      

        
    try {
         const token = authHeader.split(' ');
         const bearertoken=token[1];
        const blacklistedtoken= blacklist.findOne({token:bearertoken});

            if(blacklistedtoken){
                 return res.status(201).json({ 
                    success: true, 
                    msg: 'session is expired,please logIn again' });
            }

        const decoded = jwt.verify(bearertoken, process.env.ACCESS_TOKEN_SECRET);
        
        req.user = decoded; // attaches decoded user data to request
        next(); // allows the request to continue to controller
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Invalid Token' });
    }

}

module.exports={authenticate}