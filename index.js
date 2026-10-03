require("dotenv").config();

// Fix for SRV / ECONNREFUSED DNS resolution issues in Node.js
const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const authRoute = require("./Routes/AuthRoute");
const { HoldingModel } = require("./models/HoldingModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// ======================
// 1. CORS SETUP (Fixed)
// ======================
const allowedOrigins = [
  "http://localhost:3000",                      // Frontend (dev)
  "http://localhost:3001",                      // Dashboard (dev)
  "http://localhost:3002",
  "https://zerodha-trading-app-509w.onrender.com", // Your frontend on Render
  // Add more production domains here later if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Temporarily allow all origins (remove later in production)
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// ======================
// 2. MIDDLEWARES
// ======================
app.use(express.json());
app.use(cookieParser());

// ======================
// 3. ROUTES
// ======================
app.use("/", authRoute);

// Holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Positions
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New Order
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route (useful for Render)
app.get("/", (req, res) => {
  res.json({
    message: "Zerodha Backend is running successfully!",
    status: "OK",
  });
});

// ======================
// 4. DATABASE + SERVER
// ======================
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });