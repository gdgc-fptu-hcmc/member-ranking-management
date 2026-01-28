import express from "express";
import {
  getChatHistory,
  getGeminiResponse,
} from "../controllers/geminiController.js";

const router = express.Router();
// each req  have guestId(cookie) + if there is token => decode

router.get("/history", getChatHistory);
router.post("/send", getGeminiResponse);

export default router;
