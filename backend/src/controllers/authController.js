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
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        roles: user.roles,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30d" }
    );
  },
  generateRefreshToken: (user) => {
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
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "strict",
        });
        const safeUser = await User.findById(user._id).select("-password -refreshToken");
        res.status(200).json({
          user: safeUser, accessToken, roles: user.roles });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //refreshToken
  requestRefreshToken: async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("You're not authenticated");
    }

    //  verify chữ ký refresh token
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json("Refresh token is not valid");
        }

        // tìm user có refreshToken này
        const user = await User.findOne({ refreshToken });
        if (!user) {
          return res.status(403).json("Refresh token is not valid");
        }

        // tạo token mới
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);

        // rotate refresh token (ghi đè)
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "strict",
        });
        const safeUser = await User.findById(user._id).select("-password -refreshToken");
        return res.status(200).json({
          accessToken: newAccessToken,
          roles: user.roles,
          user : safeUser,
        });
      }
    );
  } catch (error) {
    return res.status(500).json(error.message);
  }
},


  userLogout: async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      path: "/",
      sameSite: "strict",
    });

    return res.status(200).json("logout");
  } catch (error) {
    return res.status(500).json(error.message);
  }
},

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
