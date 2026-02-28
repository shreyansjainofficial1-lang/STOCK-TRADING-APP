const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoute");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoute");
const stockRoutes = require("./routes/stockRoute");
const middlewares = require("./middlewares/authMiddleware")
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/users", userRoutes);

app.use("/api/stocks", stockRoutes);

app.get("/", (req, res) => {
  res.send("SB Stocks API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});