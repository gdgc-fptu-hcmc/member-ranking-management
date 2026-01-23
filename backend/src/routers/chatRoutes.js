import express from "express";
import { getChatHistory, getGeminiResponse } from "../controllers/geminiController.js";
import { ensureGuestId } from "../controllers/guestController.js";
import { optionalAuth } from "../controllers/optionalAuth.js";

const router = express.Router();
// each req  have guestId(cookie) + if there is token => decode
router.use(ensureGuestId);
router.use(optionalAuth);

router.get("/history", getChatHistory);
router.post("/send", getGeminiResponse);

export default router;
