const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);