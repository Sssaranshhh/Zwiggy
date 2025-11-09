import User from "../models/user.model";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    const user = await User.findOne(email);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must have atleast 8 characters" });
    }

    if (mobile.length != 10) {
      return res.status(400).json({ message: "Invalid mobile no" });
    }

    const hashedPassword = bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json(`Error in signUp: ${err} in auth.controller`);
  }
};

const signIn = async (req, res) => {
  try {
    const {email, password } = req.body;

    const user = await User.findOne(email);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({message: "Incorrect Password"});
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
   
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(`Error in signIn: ${err} in auth.controller`);
  }
};