import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../src/lib/supabase";
import { useAuth } from "../src/context/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (user) {
    return <Navigate to={"/my-projects"} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please enter both username and password");
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.session) {
      console.log("Login error:", authError?.message);
      setErrorMessage(authError?.message || "Login failed");
      return;
    }

    // 2️⃣ Exchange token (SSO)
    // const { error: exchangeError } =
    //   await supabase.functions.invoke("exchange-token");

    // if (exchangeError) {
    //   throw exchangeError;
    // }

    // 3️⃣ Redirect user
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-bold text-black mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              Sign in to access your account
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              Login successful!
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:border-black transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:border-black transition-colors"
                placeholder="Enter your password"
                required
              />
              {errorMessage && (
                <span className="text-red-600">{errorMessage}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-black hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
