const express = require("express");
const router = express.Router();

const { getOrders } = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getOrders);

module.exports = router;