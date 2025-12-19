import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const Plans = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:support@dome7.com?subject=Subscription Request - ${
      selectedPlan.name
    } Plan&body=Name: ${formData.name}%0D%0AEmail: ${
      formData.email
    }%0D%0APhone: ${formData.phone}%0D%0ACompany: ${
      formData.company
    }%0D%0AMessage: ${formData.message}%0D%0A%0D%0APlan Details:%0D%0A- Plan: ${
      selectedPlan.name
    }%0D%0A- Price: ${selectedPlan.price}${
      selectedPlan.period
    }%0D%0A- Features: ${selectedPlan.features.join(", ")}`;
    window.location.href = mailtoLink;
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

  const plans = [
    {
      name: "Platinum",
      price: "$682",
      period: "/year",
      subtitle: "INCLUDES ONE YEAR DOME 7 LICENCE",
      features: [
        "2K to 6K (yearly)",
        "Unlimited projects",
        "500 4k rendering per year",
        "Exclusive 3d model library",
        "Automatic and downloadable bill of materials",
        "Up to 500 3d models upload",
        "Online/offline support",
      ],
      bgColor: "bg-gray-500",
      textColor: "text-white",
      buttonBg: "bg-[#d4c5a9]",
      buttonText: "text-black",
    },
    {
      name: "Gold",
      price: "$3978",
      period: "/year",
      subtitle: "INCLUDES VR INTEGRATED LICENCE PLUS ONE YEAR DOME 7 LICENCE",
      features: [
        "2K to 8K (yearly)",
        "Unlimited projects",
        "Unlimited 4k rendering",
        "Unlimited 720-degree tours",
        "Exclusive 3d model library",
        "Automatic and downloadable bill of materials",
        "Online/offline support",
      ],
      bgColor: "bg-gradient-to-br from-yellow-600 to-yellow-800",
      textColor: "text-white",
      buttonBg: "bg-[#d4c5a9]",
      buttonText: "text-black",
    },
    {
      // add more feature in diamond plan
      name: "Diamond Ultra",
      price: "Custom",
      period: "",
      subtitle: "CUSTOM LICENCE AND FEATURES",
      features: [
        "Custom integrations",
        "Priority support",
        "Dedicated account manager",
        "Tailored feature set",
        "Custom 3d model library",
        "On-site training and onboarding",
        "Extended warranty and maintenance",
        "Custom analytics and reporting",
      ],
      bgColor: "bg-white",
      textColor: "text-black",
      buttonBg: "bg-[#d4c5a9]",
      buttonText: "text-black",
      border: "border-2 border-gray-300",
    },
  ];

  return (
    <section className="min-h-screen bg-black py-16 px-4 sm:px-6 md:px-8 lg:px-12">
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-3xl leading-none"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Subscribe to {selectedPlan?.name} Plan
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div> */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              {/* place */}
                <div>
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-700"
                >
                  Place *
                </label>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />  
                </div>
                {/* District */}
                <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District *
                </label>
                <input
                  type="text"
                  id="district" 
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
                </div>
                {/* state */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div> */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Send Subscription Request
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-widest mb-4 text-gray-400"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            PRICING
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Choose Your Plan
          </h1>
        </motion.div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className={`${plan.bgColor} ${plan.textColor} ${
                plan.border || ""
              } rounded-lg p-8 w-full lg:w-96 flex flex-col`}
            >
              {/* Plan Name */}
              <h2
                className="text-2xl font-semibold text-center mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {plan.name}
              </h2>

              {/* Subtitle */}
              {plan.subtitle && (
                <p
                  className="text-xs text-center mb-6 opacity-90"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {plan.subtitle}
                </p>
              )}

              {/* Price */}
              <div className="text-center mb-8">
                <span
                  className="text-5xl font-bold"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className="text-xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 grow">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="text-center text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setShowModal(true);
                }}
                className={`${plan.buttonBg} ${plan.buttonText} py-3 px-8 rounded-md font-semibold hover:opacity-90 transition-opacity w-full`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Subscribe
              </button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p
            className="text-gray-400 text-sm"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            All plans include priority customer support and regular updates
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Plans;
