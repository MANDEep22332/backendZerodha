const { UserSchema } = require("../Schemas/UserSchema");
const bcrypt = require("bcryptjs");
const { model} = require("mongoose");

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const User = new model("User", UserSchema)
module.exports =  User;