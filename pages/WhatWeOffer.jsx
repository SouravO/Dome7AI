import React, { useState } from "react";

const WhatWeOffer = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      title: "Interact with virtual features",
      description:
        "Transform your space like never before with our cutting-edge virtual design tools. Dive into an interactive experience where you can visualize your ideas in real time.",
    },
    {
      title: "Various virtual reality applications",
      description:
        "Explore multiple virtual reality use cases including interior design, architecture visualization, and professional demonstrations.",
    },
    {
      title: "Look around the artificial world",
      description:
        "Navigate immersive digital environments that provide a true sense of depth, scale, and spatial awareness.",
    },
    {
      title: "Image-based virtual reality systems",
      description:
        "Use image-based rendering pipelines to create realistic virtual spaces from captured visual data.",
    },
    {
      title: "Accurately register acquired 3D data",
      description:
        "Align and integrate 3D capture data with precision to ensure consistency between virtual and real-world environments.",
    },
  ];

  const toggleItem = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    /**
     * CRITICAL:
     * relative + very high z-index + pointer-events-auto
     * ensures nothing above can block clicks
     */
    <section className="relative  pointer-events-auto bg-[#000] py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* LEFT SECTION */}
        <div>
          <p className="text-sm text-white mb-10">VR Experience</p>

          <img
            src="/assets/Vr.avif"
            alt="VR Experience"
            className="rounded-lg w-full max-w-md"
          />
        </div>

        {/* RIGHT ACCORDION */}
        <div className="relative  pointer-events-auto">
          {items.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div key={index} className="border-b border-gray-300 py-4">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-lg font-medium text-white">
                    {item.title}
                  </span>

                  <svg
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
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
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-white leading-relaxed pr-4">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
