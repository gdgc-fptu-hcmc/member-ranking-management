import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { supabase } from "../lib/supabase.js";
dotenv.config();

let refreshTokens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password, avatar, isMale, address, clubRole } =
        req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "username, email, password are required" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const { data, error } = await supabase
        .from("users")
        .insert({
          username,
          email,
          password: hashed,
          // roles mặc định ['member'] theo DB
          avatar: avatar ?? null,
          is_male: typeof isMale === "boolean" ? isMale : null,
          address: address ?? null,
          club_role: clubRole ?? null,
          join_club_at: null,
        })
        .select(
          "id, username, email, roles, club_role, total_gems, regular_session_count, is_active, join_club_at, avatar, is_male, address, created_at, updated_at",
        )
        .single();

      if (error) {
        // unique violation thường sẽ vào đây (username/email trùng)
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ user: data });
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
      { expiresIn: "30d" },
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        roles: user.roles,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" },
    );
  },
  //Login
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (!user || error) {
        return res.status(404).json("Wrong username");
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).json("Wrong password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        // lưu refresh token vào DB
        await supabase
          .from("users")
          .update({ refresh_token: refreshToken })
          .eq("id", user.id);

        // set cookie refreshToken
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "strict",
        });
        // trả user safe (bỏ password + refresh_token)
        const { password: _pw, refresh_token: _rt, ...safeUser } = user;
        res.status(200).json({
          user: safeUser,
          accessToken,
          roles: user.roles,
        });
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

          // tìm user theo refresh_token trong DB
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("refresh_token", refreshToken)
          .single();
          if (!user) {
            return res.status(403).json("Refresh token is not valid");
          }

          // tạo token mới
          const newAccessToken = authController.generateAccessToken(user);
          const newRefreshToken = authController.generateRefreshToken(user);

          // rotate refresh token (ghi đè)
         await supabase.from("users").update({ refresh_token: newRefreshToken }).eq("id", user.id);

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
          });
         const { password: _pw, refresh_token: _rt, ...safeUser } = user;
          return res.status(200).json({
            accessToken: newAccessToken,
            roles: user.roles,
            user: safeUser,
          });
        },
      );
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  userLogout: async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await supabase
          .from("users")
          .update({ refresh_token: null })
          .eq("refresh_token", refreshToken);
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
