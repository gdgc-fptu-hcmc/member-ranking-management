import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import chatRoutes from "./routers/chatRoutes.js";
import authRouter from "./routers/auth.js";
import userRouter from "./routers/user.js";

// 1) Load config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// 2) Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// =====================
// 3) Routes (GIỮ HẾT CŨ)
// =====================

// Chat AI route cũ
app.use("/api/assistant", chatRoutes);

// Test routes cũ
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend! (No DB connected)", id: "1" });
});

// Data mẫu cũ
const members = [
  {
    id: 1,
    name: "Nguyễn Minh Triết",
    role: "Leader",
    points: 1200,
    avatar: "https://i.pravatar.cc/150?u=triet",
  },
  {
    id: 2,
    name: "Trần Văn A",
    role: "Core Team",
    points: 950,
    avatar: "https://i.pravatar.cc/150?u=a",
  },
  {
    id: 3,
    name: "Lê Thị B",
    role: "Member",
    points: 1100,
    avatar: "https://i.pravatar.cc/150?u=b",
  },
  {
    id: 4,
    name: "Phạm Hồng C",
    role: "Core Team",
    points: 800,
    avatar: "https://i.pravatar.cc/150?u=c",
  },
];

// Route members cũ
app.get("/api/members", (req, res) => {
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);
  res.json(sortedMembers);
});

// =====================
// 4) Routes (MỚI: AUTH)
// =====================
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

// 5) Start server (kết nối DB rồi listen 1 lần)
async function start() {
  try {
    if (!MONGO_URL) throw new Error("MONGO_URL is undefined. Check .env");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

start();
