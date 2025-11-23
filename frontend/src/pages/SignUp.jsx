import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { auth } from "../../firebase.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ClipLoader } from "react-spinners";

export default function SignUp() {
  const primaryColor = "#ff4d2d";
  // const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      console.log(result);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setError("Mobile No is required!");
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      console.log(data);
      setError("");
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Zwiggy
        </h1>
        <p className="text-gray-600 mb-8">
          Create your account to get started with delicious food deliveries
        </p>

        {/* fullName */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your Full Name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div>
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
        {/* mobile */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
            type="tel"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your Mobile Number"
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
          />
        </div>
        {/* password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
        {/* role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["User", "Owner", "DeliveryPartner"].map((r) => (
              <button
                key={r}
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white hover:bg-[#e64323]"
          style={{ backgroundColor: primaryColor }}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center my-2.5">*{error}</p>}

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>SignUp with Google</span>
        </button>
        <p className="text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
