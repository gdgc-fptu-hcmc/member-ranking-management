import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import chatRoutes from "./routers/chatRoutes.js";
import authRouter from "./routers/auth.js";
import userRouter from "./routers/user.js";
import gemLogsRouter from "./routers/gemLogs.js";
import activityRouter from "./routers/activity.js";

// 1) Load config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
// 4) Routes (MỚI: AUTH & USERS)
// =====================
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/gem-logs", gemLogsRouter);
app.use("/v1/activities", activityRouter);

// 5) Start server (kết nối DB rồi listen 1 lần)
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("error running on backend")
    process.exit(1);
  }
}

start();
