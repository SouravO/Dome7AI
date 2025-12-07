import React from "react";
import { motion } from "framer-motion";

const Plans = () => {
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
        "Removable finest logo",
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
        "Removable finest logo",
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
        "Early access to new features",
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
