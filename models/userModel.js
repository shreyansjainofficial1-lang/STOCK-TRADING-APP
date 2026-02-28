const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user"
    },
    virtualBalance: {
      type: Number,
      default: 100000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);