import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    roles: {
      type: [String],
      enum: ["member", "btc", "alumni", "admin"],
      default: ["member"],
    },
    totalGems: {
      type: Number,
      default: 0,
    },
    stats: {
      regularSessionCount: {
        type: Number,
        default: 0,
      },
      meetingsCount: {
        type: Number,
        default: 0,
      },
      competitionsCount: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);
export default mongoose.model("User", userSchema);
