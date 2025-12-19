import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    // Get checkbox values
    const analyticsCheckbox = document.getElementById("analytics-consent");
    const marketingCheckbox = document.getElementById("marketing-consent");

    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        essential: true,
        analytics: analyticsCheckbox?.checked || false,
        marketing: marketingCheckbox?.checked || false,
        timestamp: new Date().toISOString(),
      })
    );
    setIsVisible(false);
    setShowDetails(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-6xl mx-auto">
            {!showDetails ? (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">
                      We use cookies
                    </h3>
                    <p className="text-gray-300 text-sm">
                      We use essential cookies to make our website function
                      properly, and analytics cookies to understand how you use
                      our site. You can choose to accept or reject non-essential
                      cookies.{" "}
                      <Link
                        to="/cookie-policy"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Learn more
                      </Link>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <button
                      onClick={() => setShowDetails(true)}
                      className="px-4 py-2 text-white text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                    >
                      Manage Preferences
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 text-white text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 text-white text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-2xl"
              >
                <h3 className="text-white font-bold text-lg mb-4">
                  Cookie Preferences
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Essential Cookies */}
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="essential-consent"
                        defaultChecked
                        disabled
                        className="mt-1 mr-3 cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="essential-consent"
                          className="text-white font-semibold block mb-1"
                        >
                          Essential Cookies (Always Active)
                        </label>
                        <p className="text-gray-400 text-sm">
                          These cookies are necessary for the website to
                          function properly. They include session cookies for
                          login and CSRF protection.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="analytics-consent"
                        defaultChecked
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="analytics-consent"
                          className="text-white font-semibold block mb-1"
                        >
                          Analytics Cookies
                        </label>
                        <p className="text-gray-400 text-sm">
                          Help us understand how visitors use our website so we
                          can improve it. Includes Google Analytics and similar
                          tools.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="marketing-consent"
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="marketing-consent"
                          className="text-white font-semibold block mb-1"
                        >
                          Marketing Cookies
                        </label>
                        <p className="text-gray-400 text-sm">
                          Used to track visitors across websites to display
                          relevant advertising. Includes advertising pixels and
                          retargeting cookies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 text-white text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2 text-white text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
