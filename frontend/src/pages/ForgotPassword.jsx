import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredentials: true }
      );
      console.log(result);
      setStep(2);
    } catch (err) {
      console.log("Error details:", err.response?.data);
      console.log("Status:", err.response?.status);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredentials: true }
      );
      console.log(result);
      setStep(3);
    } catch (err) {
      console.log("Error details: ", err.response?.data);
      console.log("Status: ", err.response?.status);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword != confirmPassword) return null;
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );
      navigate("/signin");
      console.log(result)
    } catch (err) {
      console.log("Error details: ", err.response?.data);
      console.log("Status: ", err.response?.status);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4 text-[#ff4d2d]">
          <IoIosArrowRoundBack
            size={30}
            onClick={() => navigate("/signin")}
            className="cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        </div>

        {step == 1 && (
          <div>
            {/* email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button className="w-full font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#ff4d2d] hover:bg-[#e64323]"
            onClick={handleSendOtp}>
              Send OTP
            </button>
          </div>
        )}

        {step == 2 && (
          <div>
            {/* OTP */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button className="w-full font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#ff4d2d] hover:bg-[#e64323]"
            onClick={handleVerifyOtp} >
              Submit
            </button>
          </div>
        )}

        {step == 3 && (
          <div>
            {/* New password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Enter your new Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
                <button
                  className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>
            {/* Confirm password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Confirm your new Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
                <button
                  className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>
            <button className="w-full font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#ff4d2d] hover:bg-[#e64323]"
            onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
