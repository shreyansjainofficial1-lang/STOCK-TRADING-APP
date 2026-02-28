const express = require("express");
const router = express.Router();
const { buyStock } = require("../controllers/transactionController");
const { sellStock } = require("../controllers/transactionController");
const { getTransactionHistory } = require("../controllers/transactionController");
const { getPortfolio } = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/buy", protect, buyStock);
router.post("/sell", protect,sellStock);
router.get("/history", protect, getTransactionHistory);
router.get("/portfolio", protect, getPortfolio);

module.exports = router;