const express = require("express");
const router = express.Router();

const { createStock, getStocks, getStockBySymbol, updateStock, deleteStock } = require("../controllers/stockController");
const { protect,admin } = require("../middlewares/authMiddleware");

// Public route
router.get("/", getStocks);
router.get("/:symbol", getStockBySymbol);

// Protected route (only logged in users can add stock)
router.post("/", protect, createStock);

router.post("/", protect, admin, createStock);

router.put("/:id",protect, admin, updateStock );
router.delete("/:id",protect,admin,deleteStock)
module.exports = router;