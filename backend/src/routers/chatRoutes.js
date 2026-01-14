import express from "express";
import { getGeminiResponse } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/", getGeminiResponse);

export default router;
