import React from "react";
import ScrollFloat from "../src/components/ui/components/ScrollFloat";
import ScrollReveal from "../src/components/ui/components/ScrollReveal";

const WhatWeDo = () => {
  return (
    <section className="min-h-[80vh] bg-black py-8 sm:py-12 md:py-16 lg:py-20 px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-start">
      <div className="max-w-6xl mx-auto w-full">
        {/* Heading with ScrollFloat */}
        <div className="min-h-[25vh] flex items-center justify-center">
          <ScrollFloat
            animationDuration={1.5}
            ease="back.inOut(2)"
            scrollStart="top bottom"
            scrollEnd="center center"
            stagger={0.08}
            containerClassName="text-center"
            textClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight"
          >
            WHAT WE DO
          </ScrollFloat>
        </div>

        {/* Spacer for scroll delay */}
        <div className="h-[10vh]" />

        {/* Content with ScrollReveal */}
        <div className="min-h-[30vh] flex items-center justify-center">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={3}
            blurStrength={8}
            containerClassName="text-center"
            textClassName="text-gray-300 font-normal text-lg sm:text-xl md:text-2xl"
            rotationEnd="center center"
            wordAnimationEnd="center top+=30%"
          >
            Dome7AI is an online design and information platform for businesses
            in the home décor and furnishing industry. It supports 3D model
            creation, material and texture customization, and advanced floor
            planning, with visualization through photo-realistic rendering, and
            virtual reality. The platform is built on a modern, optimized web
            architecture for reliable cross-device performance.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
