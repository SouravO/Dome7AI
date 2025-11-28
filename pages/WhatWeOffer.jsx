import React, { useState } from "react";
import { motion } from "framer-motion";

const WhatWeOffer = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const offerings = [
    {
      title: "Real-Time Virtual Interaction",
      description:
        "Interact directly with virtual spaces through real-time controls that allow you to modify layouts, reposition elements, and experience design changes instantly within a dynamic environment.",
    },
    {
      title: "Multi-Purpose Virtual Design Solutions",
      description:
        "A broad set of virtual applications supporting interior design, architectural visualization, and professional demonstrations, suitable for both residential and commercial design requirements.",
    },
    {
      title: "Immersive Spatial Exploration",
      description:
        "Navigate digitally constructed environments with full spatial freedom, enabling detailed inspection of scale, depth, and layout from every perspective prior to implementation.",
    },
    {
      title: "High-Fidelity Visual Representation",
      description:
        "Generate highly detailed visual outputs that accurately represent materials, textures, and lighting, delivering a realistic preview of finalized design concepts.",
    },
    {
      title: "Accurate 3D Spatial Alignment",
      description:
        "Import and align detailed 3D capture data with precision to reflect real-world dimensions, ensuring consistency between digital models and physical spaces",
    },
  ];

  const toggleAccordion = (index) => {
    console.log("Clicked index:", index, "Current openIndex:", openIndex);
    setOpenIndex(openIndex === index ? null : index);
  };

  console.log("Current openIndex state:", openIndex);

  return (
    <section className="min-h-screen bg-[#000] py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
              <img
                src="/assets/photo-1618221195710-dd6b41faaea6.avif"
                alt="Person using VR headset"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-8 leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Multi-projected
              <br />
              environments
            </motion.h2> */}
          </motion.div>

          {/* Right Side - Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-4"
          >
            {offerings.map((item, index) => {
              const isOpen = openIndex === index;
              console.log(`Item ${index} isOpen:`, isOpen);

              return (
                <div key={index} className="border-b border-gray-400 pb-4">
                  <button
                    onClick={() => {
                      console.log("Button clicked for index:", index);
                      toggleAccordion(index);
                    }}
                    className="w-full flex items-center justify-between text-left group py-2"
                    aria-expanded={isOpen}
                    type="button"
                  >
                    <h3
                      className="text-lg sm:text-xl md:text-2xl font-medium text-white group-hover:text-gray-300 transition-colors pr-4"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-6 h-6 text-white transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pt-4">
                      <p
                        className="text-sm sm:text-base text-gray-300 leading-relaxed"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
