const { model} = require("mongoose");

const {HoldingSchema} = require("../Schemas/HolidingSchema");


const HoldingModel = new model("holding",HoldingSchema);

module.exports = {HoldingModel};