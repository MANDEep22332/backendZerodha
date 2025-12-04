const { UserSchema } = require("../Schemas/UserSchema");
const bcrypt = require("bcryptjs");
const { model} = require("mongoose");

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});


module.exports =   new model("User", UserSchema);