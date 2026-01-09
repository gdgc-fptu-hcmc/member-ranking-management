import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

// 1. Load config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware (Allows Frontend to talk to Backend)
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/assistant", chatRoutes);

// 3. Test Routes (No Database needed)
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend! (No DB connected)", id: "1" });
});

// 4. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// Thêm danh sách dữ liệu mẫu vào file backend/src/index.js
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

// Route lấy danh sách thành viên và sắp xếp theo thứ hạng
app.get("/api/members", (req, res) => {
  // Sắp xếp giảm dần theo số điểm
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);
  res.json(sortedMembers);
});
