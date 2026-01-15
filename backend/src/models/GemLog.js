import mongoose from "mongoose";

const gemLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number, // Có thể âm (nếu trừ điểm) hoặc dương (nếu cộng điểm)
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    // Nguồn gốc phát sinh giao dịch này
    source: {
      kind: {
        type: String,
        enum: [
          "activity_checkin",
          "admin_adjust",
          "achievement",
          "competition",
          "system",
        ],
        required: true,
      },
      activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
      checkinId: { type: mongoose.Schema.Types.ObjectId, ref: "Checkin" },
      evidenceUrls: [{ type: String }],
    },
    // Thông tin về thực thể thực hiện hành động này
    createdBy: {
      actorType: { type: String, enum: ["system", "admin"], required: true },
      actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Nếu là admin thì lưu ID admin
    },
    // Thông tin về người yêu cầu (ví dụ: member gửi yêu cầu cộng điểm thành tích)
    requestedBy: {
      actorType: { type: String, enum: ["member", "admin", "system"] },
      actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    // Phần dành cho AI
    aiMeta: {
      tool: { type: String, default: "gemini-3.0-flash" },
      inputType: { type: String, enum: ["voice", "text", "image"] },
      rawAiResponse: { type: mongoose.Schema.Types.Mixed }, // Lưu phản hồi thô từ AI để kiểm chứng
    },
  },
  {
    timestamps: true, // createdAt chính là thời điểm giao dịch xảy ra
  }
);

export default mongoose.model("GemLog", gemLogSchema);
