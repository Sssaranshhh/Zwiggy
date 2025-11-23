import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendMailOtp } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    let user = await User.findOne({email});
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

    const hashedPassword = await bcrypt.hash(password, 10);
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

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
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

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error in signOut: ${err} in auth.controller` });
  }
};

export const sendOtp = async (req,res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist."})
    }
    const otp =  Math.floor(100000 + Math.random()*900000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 10*60*1000;
    user.isOtpVerified = false;
    await user.save();
    await sendMailOtp(user.email,otp);
    return res.status(200).json({message: "otp sent successfully."})
  } catch (err) {
    return res.status(500).json({ message: "Error otp was not sent successfully: ", err });
  }
}

export const verifyOtp = async (req,res) => {
    try {
      const {email,otp} = req.body;
      const user = await User.findOne({email});
      if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid/Expired OTP" });
      }
      user.resetOtp = otp;
      user.isOtpVerified = true;
      user.otpExpires = undefined;
      await user.save();
      return res.status(200).json({message:"Email verified successfully"});
    } catch (err) {
      return res.status(500).json({message: "Error while verifying the otp: ", err});
    }
}

export const resetPassword = async (req,res) => {
  try {
    const {email, newPassword} = req.body;
    const user = await User.findOne({email});
    if(!user || !user.isOtpVerified){
      return res.status(400).json({ message: "Otp verification required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({message: "Password reset successfull"});
  } catch (err) {
    return res.status(500).json({message: "Error while resetting password: ", err});
  }
} 

export const googleAuth = async (req,res) => {
  try {
    const {fullName, email, mobile, role} = req.body;
    let user = await User.findOne({email});
    if(!user){
      user = await User.create({
        fullName, email, mobile, role
      })
    }

    const token = genToken(user._id);
    res.cookie( "token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 30*24*60*60*1000,
      httpOnly: true
    })
    return res.status(200).json({user});
  } catch (err) {
    return res.status(500).json(`google auth error: ${err}`)
  }
}