import { Router } from "express";
import authController from "../controllers/authController.js";
import middlewareController from "../controllers/middlewareController.js";

const router = Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout", authController.userLogout );
export  default router;


