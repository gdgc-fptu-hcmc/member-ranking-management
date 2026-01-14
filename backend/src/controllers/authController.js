import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

let refreshTokens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //generate ACCESS TOKEN
    generateAccessToken: (user)=>{
        return jwt.sign(
            {
            id: user.id,
            roles: user.roles,
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "30d" }
        );
    },
    generateRefreshToken: (user)=>{
        return jwt.sign(
          {
            id: user.id,
            roles: user.roles,
          },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "365d" }
        );
    },
  //Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path:"/",
            sameSite: "strict",
        })
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //refreshToken
  requestRefreshToken: async(req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(200).json("You're not authenticated");
    if(!refreshTokens.includes(refreshToken)){
        return res.status(200).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user)=>{
        if(err){
            console.log(err);
        }
        refreshTokens = refreshTokens.filter((token)=> token !== refreshToken);
        //create new accessToken, refreshToken
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            path:"/",
            sameSite: "strict",
        });
        return res.status(200).json({accessToken: newAccessToken});
    })
  },

  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter( token => token !== req.cookies.refreshToken);
    return res.status(200).json("logout");
  }

};
//Store token:
//1) Local storage:
//XSS
//2) HTTPONLY COOKIES:
//CSRF --> samesite
//3) REDUX STORE -> AccessToken
//HTTPOnly cookies -> refreshToken
//Dùng BFF PARTERN 

export default authController;
