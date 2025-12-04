"use client";

import React from "react";
import { motion } from "framer-motion";

const aboutImage = "/assets/premium_photo-1676968002767-1f6a09891350.avif";
const aboutsImage = "/assets/kam-idris-_HqHX3LBN18-unsplash.jpg";

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full min-h-screen bg-black py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-start lg:items-center min-h-fit">
          {/* Left Side - Content */}
          <motion.div
            className="w-full h-auto lg:h-full flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              className="mb-6 sm:mb-8 md:mb-10"
              variants={itemVariants}
            >
              <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 font-medium">
                About Us
              </p>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight"
              variants={itemVariants}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Design With Intention
            </motion.h2>

            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              Dome7AI is a high-performance 3D design and visualization
              platform designed to increase productivity and reduce production
              costs for interior and exterior design workflows. From a single
              base model, the platform enables the creation of multiple unique
              design variations with minimal effort, while delivering
              ultra-high-resolution renders from 4K to 32K in under 60 seconds
              for rapid, professional visualization.
            </motion.p>

            <motion.a
              href="#"
              className="inline-flex items-center gap-3 text-white font-semibold uppercase text-xs sm:text-sm tracking-widest hover:text-gray-300 transition-colors duration-300 pb-2 border-b-2 border-white hover:border-gray-300 w-fit"
              variants={itemVariants}
            >
              <span>Learn More</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.a>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div
            className="w-full h-72 sm:h-80 md:h-96 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Main Large Image - Left */}
            <motion.div
              className="col-span-1 row-span-2 h-full overflow-hidden"
              variants={imageVariants}
            >
              <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={aboutImage}
                  alt="Design showcase main"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Top Right Small Image */}
            <motion.div
              className="col-span-1 h-full overflow-hidden"
              variants={imageVariants}
              transition={{ delay: 0.1 }}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={aboutsImage}
                  alt="Design detail 1"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
