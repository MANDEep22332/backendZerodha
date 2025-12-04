require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());                    // to read JSON body
app.use(cookieParser());

app.use(cors({
origin: ["http://localhost:3001", "http://localhost:3000"],// Allow requests from both ports
credentials: true// Allows cookies
}));


const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./Routes/AuthRoute");
const { HoldingModel } = require("./Models/HoldingModel");

const { PositionsModel } = require("./Models/PositionsModel");
const { OrdersModel } = require("./Models/OrdersModel");


const PORT =  3002;
const uri = process.env.MONGO_URL;


app.use(bodyParser.json());
app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingModel.find({});
  res.json(allHoldings);
});
 
app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  newOrder.save();

  res.send("Order saved!");
});

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

  app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


