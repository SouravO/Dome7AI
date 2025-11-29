import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollFloat from "../src/components/ui/components/ScrollFloat";

const VrImage = "/assets/Vr-1.avif";
const VrImages = "/assets/VR-2.avif";

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      id: 1,
      title: "Augmented Reality",
      location: "Dome7AI, 2024",
      date: "01/04",
      description:
        "Transform your reality with our cutting-edge AR solutions. Overlay digital content seamlessly onto the physical world for enhanced user experiences, training simulations, and interactive marketing campaigns.",
      concept: "Advanced AR technology for business and entertainment.",
      mainImage: VrImages,
      accentImage: VrImage,
      palette:
        "Applications: Training, Marketing, Product Visualization, Gaming",
    },
    {
      id: 2,
      title: "Mixed Reality",
      location: "Dome7AI, 2024",
      date: "02/04",
      description:
        "Experience the perfect blend of physical and digital worlds. Our MR solutions enable natural interaction with both real and virtual objects, creating unprecedented possibilities for collaboration and innovation.",
      concept: "Seamless integration of virtual and physical environments.",
      mainImage: VrImages,
      accentImage: VrImage,
      palette:
        "Features: Real-time interaction, Spatial awareness, Multi-user collaboration",
    },
    {
      id: 3,
      title: "VR Styled Technology",
      location: "Dome7AI, 2024",
      date: "03/04",
      description:
        "Immerse yourself in fully realized virtual environments. Our VR technology delivers unparalleled experiences for gaming, training, design visualization, and virtual events with stunning realism.",
      concept: "Complete virtual immersion for next-gen experiences.",
      mainImage: VrImages,
      accentImage: VrImage,
      palette:
        "Capabilities: 360° environments, Motion tracking, Haptic feedback",
    },
    {
      id: 4,
      title: "Projector-Based Reality",
      location: "Dome7AI, 2024",
      date: "04/04",
      description:
        "Revolutionize physical spaces with projection mapping technology. Create stunning visual experiences that transform surfaces into dynamic, interactive displays for events, exhibitions, and installations.",
      concept: "Spatial augmentation through advanced projection systems.",
      mainImage: VrImages,
      accentImage: VrImage,
      palette:
        "Solutions: Event production, Architectural mapping, Interactive installations",
    },
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [projects.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const currentProject = projects[currentIndex];

  return (
    <section className="min-h-screen bg-black py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs tracking-widest mb-3 sm:mb-4 md:mb-6 text-gray-400"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Services
          </motion.p>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="top bottom-=20%"
            scrollEnd="center center"
            stagger={0.05}
            containerClassName="mb-0"
            textClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white"
          >
            OUR SERVICES
          </ScrollFloat>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-start">
          {/* Left Side - Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`main-${currentIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="relative w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={currentProject.mainImage}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-between space-y-4 sm:space-y-6 md:space-y-8"
            >
              {/* Project Title and Description */}
              <div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {currentProject.title}
                </h2>
                <p
                  className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6 md:mb-8"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {currentProject.description}
                </p>
              </div>

              {/* Accent Image */}
              <div className="w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px]">
                <div className="w-full h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px] bg-gray-200 rounded-lg overflow-hidden mb-3 sm:mb-4">
                  <img
                    src={currentProject.accentImage}
                    alt="Accent"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-xs sm:text-sm text-gray-400 leading-relaxed"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {currentProject.palette}
                </p>
              </div>

              {/* Concept Description */}
              <div>
                <p
                  className="text-sm sm:text-base text-gray-300"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {currentProject.concept}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-all"
                  aria-label="Previous project"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-all"
                  aria-label="Next project"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Progress Indicators */}
                <div className="flex gap-2 ml-4">
                  {projects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? "bg-white w-8"
                          : "bg-gray-600 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Services;
