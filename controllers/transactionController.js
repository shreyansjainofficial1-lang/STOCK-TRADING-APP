const Transaction = require("../models/transactionModel");
const Stock = require("../models/stockSchema");
const Portfolio = require("../models/portfolioModel");
const User = require("../models/userModel");
const Order = require("../models/orderSchema");


const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const portfolio = await Portfolio.findOne({
      user: req.user._id,
      stock: stockId
    });

    if (!portfolio) {
      return res.status(404).json({ message: "User does not own this stock" });
    }

    if (portfolio.quantity < quantity) {
      return res.status(400).json({ message: "Cannot sell more than owned" });
    }

    const totalAmount = stock.currentPrice * quantity;

    const user = await User.findById(req.user._id);
    await Order.create({
    user: user._id,
    stock: stock._id,
    type:"sell",
    quantity,
    price: stock.currentPrice,
    totalAmount,
    status: "completed"
    });

    

    // Increase balance
    user.virtualBalance += totalAmount;
    await user.save();

    // Save transaction
    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      type: "sell",
      quantity,
      price: stock.currentPrice,
      totalAmount
    });

    // Reduce portfolio quantity
    portfolio.quantity -= quantity;

    if (portfolio.quantity === 0) {
      await portfolio.deleteOne();
    } else {
      await portfolio.save();
    }

    res.status(201).json({
      message: "Stock sold successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const totalAmount = stock.currentPrice * quantity;

     const user = await User.findById(req.user._id);

        await Order.create({
    user: user._id,
    stock: stock._id,
    type: "buy",
    quantity,
    price: stock.currentPrice,
    totalAmount,
    status: "completed"
    });

   

    if (user.virtualBalance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.virtualBalance -= totalAmount;
    await user.save();

    // Save transaction
    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      type: "buy",
      quantity,
      price: stock.currentPrice,
      totalAmount
    });

    // Update portfolio
    let portfolio = await Portfolio.findOne({
      user: user._id,
      stock: stock._id
    });

    if (portfolio) {
      portfolio.quantity += quantity;
      await portfolio.save();
    } else {
      await Portfolio.create({
        user: user._id,
        stock: stock._id,
        quantity
      });
    }

    res.status(201).json({
      message: "Stock purchased successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate("stock")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({
      user: req.user._id
    }).populate("stock");

    // Optional: calculate total portfolio value
    const totalValue = portfolio.reduce((acc, item) => {
      return acc + item.quantity * item.stock.currentPrice;
    }, 0);

    res.json({
      totalValue,
      holdings: portfolio
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { buyStock, sellStock, getTransactionHistory,getPortfolio };