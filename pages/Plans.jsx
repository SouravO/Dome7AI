import React from "react";
import { motion } from "framer-motion";

const Plans = () => {
  const plans = [
    {
      name: "Platinum",
      price: "$900",
      period: "/year",
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
      bgColor: "bg-black",
      textColor: "text-white",
      buttonBg: "bg-[#d4c5a9]",
      buttonText: "text-black",
    },
    {
      name: "Diamond",
      price: "$1445",
      period: "/year",
      features: [
        "4K TO 32K (yearly)",
        "Unlimited projects",
        "Unlimited rendering in 4k",
        "Unlimited 720-degree tours</",
        "Exclusive 3d model library",
        "Removable finest logo",
        "Online/offline support",
        "Automatic and downloadable bill of materials",
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
          <p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Select the perfect plan for your 3D rendering and visualization
            needs
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`${plan.bgColor} ${plan.textColor} ${
                plan.border || ""
              } rounded-lg p-8 w-full lg:w-96 flex flex-col`}
            >
              {/* Plan Name */}
              <h2
                className="text-2xl font-semibold text-center mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {plan.name}
              </h2>

              {/* Price */}
              <div className="text-center mb-8">
                <span
                  className="text-5xl font-bold"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow">
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
