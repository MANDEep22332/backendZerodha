import { model } from "mongoose";

import { PositionsSchema } from "../Schemas/PositionsSchema";


const PositionsModel = new model("position",PositionsSchema);


export default {PositionsModel};