const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{


    // console.log("Request headers:", req.headers);
    const authHeader = req.headers?.authorization;
        
    if(!authHeader ){
            return res.status(401).json({ success: false, msg: 'No token provided' })
    }
      
    const token = authHeader.split(' ');
    const bearertoken=token[1];
        
    try {
        
        const decoded = jwt.verify(bearertoken, process.env.JWT_SECRET);
       
        req.user = decoded; // attaches decoded user data to request
        next(); // allows the request to continue to controller
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Invalid Token' });
    }

}

module.exports={authenticate}