"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // 🔥 FIX: Apply Sketchfab zoom using Viewer API
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "api.ready") {
        const api = event.source;

        // Move camera backwards (make model smaller)
        api.postMessage({
          type: "api.setCameraLookAt",
          position: [0, 0, 12], // 👈 Increase this for smaller model (8, 10, 12)
          target: [0, 0, 0],
          duration: 0.5,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const modelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="w-full min-h-screen bg-red-500 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 sm:mb-16 md:mb-20 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 font-medium mb-4">
            Get In Touchaaa
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Contact Us
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Left Side */}
          <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="mb-10 sm:mb-12" variants={itemVariants}>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                Let's Talk About Your Project
              </h3>

              {/* Contact Info */}
              <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
                {/* Phone */}
                <motion.div
                  className="flex gap-4 sm:gap-6"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="flex items-center justify-center h-12 w-12 rounded-full text-black"
                      style={{ backgroundColor: "#c9bbaa" }}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                      Phone
                    </p>
                    <p className="text-lg sm:text-xl text-white font-semibold">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  className="flex gap-4 sm:gap-6"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="flex items-center justify-center h-12 w-12 rounded-full text-black"
                      style={{ backgroundColor: "#c9bbaa" }}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                      Email
                    </p>
                    <p className="text-lg sm:text-xl text-white font-semibold">
                      hello@solhaus.com
                    </p>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div
                  className="flex gap-4 sm:gap-6"
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="flex items-center justify-center h-12 w-12 rounded-full text-black"
                      style={{ backgroundColor: "#c9bbaa" }}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                      Address
                    </p>
                    <p className="text-lg sm:text-xl text-white font-semibold">
                      123 Design Street, CA 90210
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={itemVariants}
            >
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none resize-none"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full px-8 py-3 bg-white text-black font-bold rounded-lg"
                whileHover={{ scale: 1.02, backgroundColor: "#e5e5e5" }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Right Side – Model */}
          <motion.div
            className="w-full h-96 sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-xl overflow-hidden"
            variants={modelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="sketchfab-embed-wrapper w-full h-full">
              <iframe
                id="sketchfab-model" // 👈 Needed for API control
                title="Oculus Quest 2"
                frameBorder="0"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                xr-spatial-tracking="true"
                src="https://sketchfab.com/models/3284672ec1524a82ab3dd0c668868fad/embed?autospin=1&autostart=1&transparent=1&ui_controls=1"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
