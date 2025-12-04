require("dotenv").config();
const  {User} = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
    
      if (user) return res.json({ status: true, user: user.username });
      else return res.json({ status: false });
    }
  });
};

module.exports.Logout = (req, res, next) => {
  res.clearCookie("token");
  res.redirect("https://zerodha-trading-app-509w.onrender.com/");

}