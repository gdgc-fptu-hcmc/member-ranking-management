import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "weekly",
        "monthly",
        "meeting",
        "study_achievement",
        "competition",
        "others",
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: "Online",
    },
    // Logic về điểm danh & tặng Gem
    gemRule: {
      checkInEnabled: {
        type: Boolean,
        default: false,
      },
      checkInGems: {
        type: Number,
        default: 0,
      },
      requiresEvidence: {
        type: Boolean,
        default: false, // Nếu true, member phải upload ảnh/minh chứng mới được tính
      },
      checkInMinute: {
        type: Number,
        default: 30, // Mặc định cho phép điểm danh trong 30p đầu
      },
    },
    // Người tạo activity (thường là Admin/BTC)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "done"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ startsAt: 1, status: 1 });

export default mongoose.model("Activity", activitySchema);
