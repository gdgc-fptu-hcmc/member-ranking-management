import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



export const optionalAuth = (req, res, next) => {
    const tokenHeader = req.headers.token;

    if(!tokenHeader) return next();

    const parts = tokenHeader.split(" ");

    if(parts.length!==2 || parts[0] !== "Bearer") return next();

    const accessToken = parts[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user)=>{
        if(!err&&user){
            req.user = user;//id or role
            next();
        }
    });
    
}