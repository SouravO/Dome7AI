import React from "react";

const WhatWeDo = () => {
  return (
    <section className="min-h-[80vh] bg-black py-8 sm:py-12 md:py-16 lg:py-20 px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-start">
      <div className="max-w-6xl mx-auto w-full">
        {/* Static heading */}
        <div className="min-h-[25vh] flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
            WHAT WE DO
          </h1>
        </div>

        {/* Spacer */}
        <div className="h-[10vh]" />

        {/* Static content */}
        <div className="min-h-[30vh] flex items-center justify-center">
          <p className="text-gray-300 font-normal text-lg sm:text-xl md:text-2xl text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
            Dome7AI is an online design and information platform for businesses
            in the home décor and furnishing industry. It supports 3D model
            creation, material and texture customization, and advanced floor
            planning, with visualization through photo-realistic rendering, and
            virtual reality. The platform is built on a modern, optimized web
            architecture for reliable cross-device performance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
