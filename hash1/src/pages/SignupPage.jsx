// src/pages/SignupPage.jsx
import React, { useState } from "react";
import Header from "../components/Header"; // Assuming this path is correct
import Wrapper from "../util/Wrapper"; // Assuming this path is correct
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiInfo,
  FiHash,
  FiCreditCard,
} from "react-icons/fi"; // Added more icons
import { IoPersonAddOutline } from "react-icons/io5";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "", // Will be sent as 'username' to backend
    dept: "",
    branch: "",
    mobno: "",
    rollNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" }); // For success/error messages from API
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
    setApiMessage({ type: "", text: "" }); // Clear API message on change
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setApiMessage({ type: "", text: "" }); // Clear API message on change
  };

  const validateInitialForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.dept.trim()) newErrors.dept = "Department is required.";
    // Branch might be optional, adjust if needed
    // if (!formData.branch.trim()) newErrors.branch = "Branch is required.";
    if (!formData.mobno.trim()) newErrors.mobno = "Mobile Number is required.";
    else if (!/^\d{10}$/.test(formData.mobno))
      newErrors.mobno = "Mobile Number must be 10 digits.";
    if (!formData.rollNumber.trim())
      newErrors.rollNumber = "Roll Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email Address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required.";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });
    if (!validateInitialForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        username: formData.name, // Map name to username
        dept: formData.dept,
        branch: formData.branch,
        mobno: formData.mobno,
        rollNumber: formData.rollNumber,
        email: formData.email,
        password: formData.password,
      };
      // Ensure VITE_API_BASE_URL is set in your .env.local (e.g., VITE_API_BASE_URL=http://localhost:3000)
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "Failed to request OTP. " + (data.message || "")
        );
      }
      setApiMessage({
        type: "success",
        text: data.message || "OTP sent successfully!",
      });
      setIsOtpStep(true);
    } catch (error) {
      setApiMessage({ type: "error", text: error.message });
      console.error("OTP Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });
    if (!otp.trim() || otp.length !== 6) {
      setApiMessage({
        type: "error",
        text: "Please enter a valid 6-digit OTP.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || "OTP verification failed. " + (data.message || "")
        );
      }
      setApiMessage({
        type: "success",
        text: data.message + " You can now log in.",
      });
      // Reset form and OTP state
      setFormData({
        name: "",
        dept: "",
        branch: "",
        mobno: "",
        rollNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setOtp("");
      setIsOtpStep(false);
      // Optionally navigate to login page after a short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setApiMessage({ type: "error", text: error.message });
      console.error("OTP Verification Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-background">
      <Header />
      <Wrapper className="flex items-center justify-center flex-grow py-12">
        <div className="w-full max-w-md p-8 border border-bdr sm:w-md bg-neutral-800 sm:p-10 rounded-xl">
          <h1 className="mb-8 text-3xl font-bold text-center text-white sm:text-4xl">
            {isOtpStep ? "Verify OTP" : "Create Account"}
          </h1>

          {apiMessage.text && (
            <p
              className={`mb-4 text-sm text-center ${
                apiMessage.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {apiMessage.text}
            </p>
          )}

          {!isOtpStep ? (
            <form onSubmit={handleRequestOtp} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.name ? "border-red-500" : "border-neutral-600"
                    }`}
                    placeholder="Your Name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="dept"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiInfo className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="dept"
                    id="dept"
                    value={formData.dept}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.dept ? "border-red-500" : "border-neutral-600"
                    }`}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                {errors.dept && (
                  <p className="mt-1 text-xs text-red-400">{errors.dept}</p>
                )}
              </div>

              {/* Branch (Optional, remove 'required' if so) */}
              <div>
                <label
                  htmlFor="branch"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Branch{" "}
                  <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiHash className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="branch"
                    id="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.branch ? "border-red-500" : "border-neutral-600"
                    }`}
                    placeholder="e.g., AI, Software Engineering"
                  />
                </div>
                {errors.branch && (
                  <p className="mt-1 text-xs text-red-400">{errors.branch}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobno"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobno"
                    id="mobno"
                    value={formData.mobno}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.mobno ? "border-red-500" : "border-neutral-600"
                    }`}
                    placeholder="10-digit mobile number"
                  />
                </div>
                {errors.mobno && (
                  <p className="mt-1 text-xs text-red-400">{errors.mobno}</p>
                )}
              </div>

              {/* Roll Number */}
              <div>
                <label
                  htmlFor="rollNumber"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Roll Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiCreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="rollNumber"
                    id="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.rollNumber
                        ? "border-red-500"
                        : "border-neutral-600"
                    }`}
                    placeholder="Your University Roll Number"
                  />
                </div>
                {errors.rollNumber && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.rollNumber}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiMail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? "border-red-500" : "border-neutral-600"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.password ? "border-red-500" : "border-neutral-600"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-neutral-600"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:bg-neutral-500"
              >
                {isLoading ? "Processing..." : "Get OTP"}
                {!isLoading && <IoPersonAddOutline className="w-5 h-5 ml-2" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-1 text-sm font-medium text-gray-300"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  maxLength="6"
                  className={`w-full px-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
                    apiMessage.type === "error" &&
                    apiMessage.text.toLowerCase().includes("otp")
                      ? "border-red-500"
                      : "border-neutral-600"
                  }`}
                  placeholder="6-digit OTP"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:bg-neutral-500"
              >
                {isLoading ? "Verifying..." : "Verify & Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setApiMessage({ type: "", text: "" });
                  setErrors({});
                }}
                disabled={isLoading}
                className="w-full mt-2 text-sm text-center text-gray-400 hover:text-indigo-300"
              >
                Back to registration details
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Log in
            </Link>
          </p>
        </div>
      </Wrapper>
    </div>
  );
};

export default SignupPage;
