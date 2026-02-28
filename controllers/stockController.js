const Stock = require("../models/stockSchema");

// Create Stock (Admin)
const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Stock
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  -- UPDATED STOCK ---//
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    stock.currentPrice = req.body.currentPrice || stock.currentPrice;
    stock.change = req.body.change || stock.change;
    stock.volume = req.body.volume || stock.volume;

    const updatedStock = await stock.save();

    res.json(updatedStock);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//--- DELETE STOCK ---//    
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await stock.deleteOne();

    res.json({ message: "Stock deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStock,
  getStocks,
  getStockBySymbol,
  updateStock,
  deleteStock
};