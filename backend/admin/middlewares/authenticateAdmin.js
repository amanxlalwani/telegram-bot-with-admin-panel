const jwt=require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
module.exports= async function authenticateAdmin(req,res,next){
    const token=req.headers.authorization?.split(' ')[1];
    try{
        const decode=await jwt.verify(token,process.env.JWT_SECRET);
        next();
    }
    catch{
        res.status(403).json({"message":"Unauthenticated request"});
    }
}