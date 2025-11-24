import React from "react";
import ModelViewer from "../src/components/ui/components/ModeViewer";

const Model = () => {
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          VR Headset Model
        </h1>
        <p
          className="text-lg text-gray-300 text-center max-w-2xl"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Interactive 3D model of Google Daydream VR Headset. Drag to rotate,
          scroll to zoom.
        </p>
        <div className="w-full max-w-4xl">
          <ModelViewer
            url="/assets/google_daydream.glb"
            width="100%"
            height={600}
            defaultRotationX={-20}
            defaultRotationY={45}
            defaultZoom={2}
            minZoomDistance={1}
            maxZoomDistance={5}
            enableMouseParallax={true}
            enableManualRotation={true}
            enableHoverRotation={true}
            enableManualZoom={true}
            ambientIntensity={0.5}
            keyLightIntensity={1.2}
            fillLightIntensity={0.6}
            rimLightIntensity={0.8}
            environmentPreset="sunset"
            autoFrame={true}
            showScreenshotButton={false}
            fadeIn={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </div>
      </div>
    </div>
  );
};

export default Model;
