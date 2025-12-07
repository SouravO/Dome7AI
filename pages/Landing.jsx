"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import ModelViewer from "../src/components/ui/components/ModeViewer";

const Landing = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <Card className="w-full min-h-screen lg:h-[700px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={300} />

      <div className="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-0">
        {/* Left content */}
        <div className="flex-1 p-6 pt-30 sm:p-18 md:p-10 lg:p-8 relative z-10 flex flex-col justify-center pb-4 lg:pb-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400 mb-4 sm:mb-2 tracking-tight leading-tight"
          >
            Dome7ai
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg leading-relaxed"
          >
            Transform spaces with innovative interior design solutions. Create
            stunning environments that reflect your vision and elevate every
            room.
          </motion.p>
          {/* Read more button and Enquiry button with gradient to navigate to sections*/}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 flex gap-4"
          >
            <button
              className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
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
              className="bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
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
        </div>

        {/* Right content - 3D Model */}
      <motion.div
  className="flex-1 relative flex items-center justify-center"
>
  <div className="relative w-full h-[70vh] min-h-[520px] lg:h-full">
    <ModelViewer
      url="/assets/base_basic_pbr.glb"
      width="100%"
      height="100%"
      defaultZoom={2.2}
      minZoomDistance={1.5}
      maxZoomDistance={6}
      enableManualRotation={false}
      enableHoverRotation={true}
      enableManualZoom={true}
      autoRotate={isMobile}
    />
  </div>
</motion.div>

      </div>
    </Card>
  );
};

export default Landing;
