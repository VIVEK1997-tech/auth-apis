const jwt=require('jsonwebtoken');

const generateAccessToken =async (user) => {
    const payload = {user};
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken =async (user) => {
    const payload = {user};
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
};

module.exports={generateAccessToken,generateRefreshToken}