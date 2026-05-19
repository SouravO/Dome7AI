import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProfileDropdown = ({ variant = "default" }) => {
  const isHeader = variant === "header";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const userEmail = user?.email || "User";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut()
    // Clear authentication data (if we manually stored it)
    localStorage.removeItem("userEmail");

    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Email Text Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          isHeader
            ? "font-medium text-xs sm:text-sm transition-colors cursor-pointer pointer-events-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/50 rounded-full px-2 sm:px-3 py-1 flex items-center gap-1 max-w-[9rem] sm:max-w-[14rem] border border-white/25 bg-black/50 text-white backdrop-blur-sm hover:border-white/50 hover:bg-black/70"
            : "text-black font-medium text-sm hover:text-gray-300 transition-colors cursor-pointer pointer-events-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded px-2 py-1 flex items-center gap-1 bg-white"
        }
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <span
          className={`truncate font-semibold ${isHeader ? "text-white" : "text-black px-1.5 py-0.5 rounded-md"}`}
        >
          {userEmail}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 ml-0.5 ${isHeader ? "text-white" : "text-black"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden pointer-events-auto"
          >
            {/* Header with user email */}
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">
                <span className="bg-yellow-400/20 px-1.5 py-0.5 rounded-md text-yellow-100 font-semibold">
                  {userEmail}
                </span>
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* <motion.button
                whileHover={{ backgroundColor: "#374151" }}
                onClick={() => {
                  navigate("/dashboard");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Dashboard
              </motion.button> */}

              <motion.button
                whileHover={{ backgroundColor: "#374151" }}
                onClick={() => {
                  navigate("/my-projects");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                My Projects
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "#374151" }}
                onClick={() => {
                  navigate("/my-account");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Account
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "#374151" }}
                onClick={() => {
                  navigate("/console");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Console
              </motion.button>

              <div className="border-t border-gray-700 my-2"></div>

              <motion.button
                whileHover={{ backgroundColor: "#7f1d1d" }}
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
