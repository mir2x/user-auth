const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationCodeExpire: {
      type: Date,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Auth = mongoose.model("Auth", authSchema);
module.exports = Auth;
