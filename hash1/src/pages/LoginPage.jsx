// import React, { useState } from "react";
// import Header from "../components/Header"; // Assuming this path is correct
// import Wrapper from "../util/Wrapper"; // Assuming this path is correct
// import { Link } from "react-router-dom";
// // Updated icon import: Replaced FiLogIn with FiArrowRightCircle
// import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     if (!formData.email.trim()) {
//       newErrors.email = "Email Address is required.";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email address is invalid.";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       console.log("Login attempt with:", formData);
//       alert("Login successful! (Simulated)");
//       setFormData({ email: "", password: "" });
//       setErrors({});
//     } else {
//       console.log("Form validation failed:", errors);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen text-white bg-background">
//       <Header />
//       <Wrapper className="flex items-center justify-center flex-grow">
//         <div className="w-full max-w-md p-8 border sm:w-md bg-neutral-800 border-bdr sm:p-10 rounded-xl">
//           <h1 className="mb-8 text-3xl font-bold text-center text-white sm:text-4xl">
//             Login
//           </h1>
//           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block mb-1 text-sm font-medium text-gray-300"
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FiMail className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   id="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     errors.email ? "border-red-500" : "border-neutral-600"
//                   }`}
//                   placeholder="you@example.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-xs text-red-400">{errors.email}</p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block mb-1 text-sm font-medium text-gray-300"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FiLock className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   id="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className={`w-full pl-10 pr-4 py-2.5 bg-neutral-700 border rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${
//                     errors.password ? "border-red-500" : "border-neutral-600"
//                   }`}
//                   placeholder="••••••••"
//                 />
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-xs text-red-400">{errors.password}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
//             >
//               Login
//               {/* Changed icon here */}
//               <FiLogIn className="w-5 h-5 ml-2" />
//             </button>

//             <p className="text-sm text-center text-gray-400">
//               Don't have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="font-medium text-indigo-400 hover:text-indigo-300"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </form>
//         </div>
//       </Wrapper>
//     </div>
//   );
// };

// export default LoginPage;

// src/pages/LoginPage.jsx
// --- MODIFIED WITH REAL LOGIN LOGIC ---

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext"; // We will create this in the next step

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the login function from our global context
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Your backend signin route is /api/auth/signin
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the backend if available
        throw new Error(
          data.error || "Login failed. Please check your credentials."
        );
      }

      // Based on your backend, the response is { message: '...', data: { token, user } }
      // We call the global login function with the token and user data
      login(data.data.token, data.data.user);

      // Redirect to the homepage on successful login
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-background">
      <Header />
      <Wrapper className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md p-8 border sm:w-md bg-neutral-800 border-bdr sm:p-10 rounded-xl">
          <h1 className="mb-8 text-3xl font-bold text-center text-white sm:text-4xl">
            Login
          </h1>

          {/* Display API errors here */}
          {error && (
            <p className="mb-4 text-sm text-center text-red-400">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                    error ? "border-red-500" : "border-neutral-600"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

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
                    error ? "border-red-500" : "border-neutral-600"
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:bg-neutral-600 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging In..." : "Login"}
              {!isLoading && <FiLogIn className="w-5 h-5 ml-2" />}
            </button>

            <p className="text-sm text-center text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </Wrapper>
    </div>
  );
};

// Corrected the export name to match the filename convention
export default LoginPage;
