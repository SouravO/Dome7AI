import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the message for WhatsApp
    const message = `*New Contact Request from Dome7AI Website*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;

    // Replace with your WhatsApp number (include country code without + sign)
    // Example: 1234567890 for US number
    const whatsappNumber = "8086762014"; // Change this to your actual WhatsApp number

    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    // Optional: Reset form after submission
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className=" bg-black px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Left Side - Heading */}
          <div className="flex flex-col justify-center">
            <p
              className="text-xs tracking-widest mb-4 sm:mb-6 text-gray-400"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              CONTACT US
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              LET'S BEGIN A CONVERSATION
            </h2>
            <p
              className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-md"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Tell us about your learning goals, technical focus areas, and
              career aspirations. We will guide you through the next steps with
              structured support and clarity.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="flex items-center">
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  required
                />
              </div>

              {/* Phone and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows="6"
                  className="w-full bg-transparent border border-gray-600 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="group flex items-center gap-3 text-sm tracking-widest font-medium text-white hover:opacity-70 transition-opacity"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  SEND REQUEST
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
