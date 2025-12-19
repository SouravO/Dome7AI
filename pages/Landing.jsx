"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import ModelViewer from "../src/components/ui/components/ModeViewer";
import { useState, useEffect, useCallback, useRef } from "react";

const Landing = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Dome 7 AI = Faster Interior Designing + Technical Accuracy + Advanced VR Experience + Cost Transparency + Maximum Creativity.";
  const indexRef = useRef(0);
  const isCountingRef = useRef(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startTyping = () => {
      indexRef.current = 0;
      isCountingRef.current = true;
      
      intervalRef.current = setInterval(() => {
        if (isCountingRef.current) {
          if (indexRef.current <= fullText.length) {
            setDisplayedText(fullText.substring(0, indexRef.current));
            indexRef.current++;
          } else {
            isCountingRef.current = false;
            setTimeout(() => {
              indexRef.current = 0;
              setDisplayedText("");
              isCountingRef.current = true;
            }, 2000);
          }
        }
      }, 50);
    };

    startTyping();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText]);

  // Animation Option 1: Gentle floating up and down
  const floatingAnimation = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  return (
    <Card className="w-full min-h-screen lg:h-[700px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={300} />

      <div className="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-0">
        {/* Left content */}
        <div className="flex-1 p-6 pt-24 sm:pt-28 sm:p-8 md:p-10 lg:p-12 relative z-10 flex flex-col justify-center pb-8 lg:pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400 mb-1 sm:mb-1 tracking-tight leading-tight"
          >
            Dome7ai
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-sm md:text-lg font-semibold bg-gradient-to-r from-[#f516ff] to-[#31b5f9] bg-clip-text text-transparent mb-6 sm:mb-8 relative"
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="ml-1 inline-block w-1 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-[#f516ff] to-[#31b5f9]"
            />
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg leading-relaxed mb-6 sm:mb-8"
          >
            Transform spaces with innovative interior design solutions. Create
            stunning environments that reflect your vision and elevate every
            room.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <button
              className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
              onClick={() => {
                const section = document.getElementById("about");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Read More
            </button>
            <button
              className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
              onClick={() => {
                const section = document.getElementById("contact");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Enquire Now
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="md:w-1/3 flex justify-center items-center "
          >
            <button
              className="bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white px-6 py-3 mt-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
              onClick={() => {
                const section = document.getElementById("contact");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Book a Free Demo
            </button>
          </motion.div>
        </div>

        {/* Right content - 3D Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex-1 relative flex items-center justify-center px-4 pb-8 lg:p-8"
        >
          <div className="w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-full max-w-[600px] lg:max-w-none">
            <ModelViewer
              url="/assets/base_basic_pbr_compressed.glb"
              width="100%"
              height="100%"
              defaultRotationX={0}
              defaultRotationY={0}
              defaultZoom={2.8}
              minZoomDistance={2}
              maxZoomDistance={6}
              enableMouseParallax={false}
              enableManualRotation={false}
              enableHoverRotation={true}
              enableManualZoom={true}
              ambientIntensity={0.5}
              keyLightIntensity={1.2}
              fillLightIntensity={0.6}
              rimLightIntensity={0.8}
              environmentPreset="sunset"
              autoFrame={false}
              showScreenshotButton={false}
              fadeIn={false}
              autoRotate={isMobile}
              autoRotateSpeed={0.5}
            />
          </div>
        </motion.div>
      </div>
    </Card>
  );
};

export default Landing;
