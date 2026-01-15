import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema(
  {
    // Link tới sự kiện nào
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    // Ai là người điểm danh
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ["qr", "manual", "self_upload"],
      required: true,
    },
    // Phần minh chứng (Rất quan trọng cho BTC duyệt)
    evidence: {
      urls: [{ type: String }], // Mảng các link ảnh minh chứng
      note: { type: String, trim: true },
    },
    // Đánh dấu xem hệ thống đã cộng Gem từ bản ghi này chưa
    // Tránh việc cộng trùng 2 lần cho 1 buổi sinh hoạt
    autoGemApplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Lưu lúc tạo record (thời điểm checkin thực tế)
  }
);

// Tạo Index kép để đảm bảo 1 User không thể check-in 2 lần cho cùng 1 Activity
checkinSchema.index({ activityId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Checkin", checkinSchema);
