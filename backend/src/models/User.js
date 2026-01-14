import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,
        trim: true
    },
    email:{
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
      enum: ["member", "bcn", "bdh", "admin", "alumni"],
      default: ["member"],
    },

    // trạng thái thành viên
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },

    department: {
      type: String, // Tech, Media, HR...
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);
export default mongoose.model("User", userSchema);