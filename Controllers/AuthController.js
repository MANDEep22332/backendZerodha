const { User } = require("../models/UserModel");
import { createSecretToken } from "../util/SecretToken";
import { compare } from "bcryptjs";

export async function Signup(req, res, next) {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
   res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
res.json({ success: true, message: "Success" });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    return next();
  } catch (error) {
    console.error(error);
  }
}




export async function Login(req, res, next) {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });
    return next() ;
  } catch (error) {
    console.error(error);
  }
}