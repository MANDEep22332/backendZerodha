const {Schema} = require("mongoose");


const HoldingSchema =  Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
});

module.exports = {HoldingSchema};