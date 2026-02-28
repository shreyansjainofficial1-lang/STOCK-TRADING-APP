const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      unique: true
    },
    companyName: {
      type: String,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    change: {
      type: Number,
      default: 0
    },
    volume: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);