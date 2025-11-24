"use client";

import { Suspense, lazy, Component } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Spline Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/50">
          <div className="text-center text-white p-4">
            <p className="text-lg mb-2">3D Scene Unavailable</p>
            <p className="text-sm text-gray-400">
              The 3D model could not be loaded
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SplineScene({ scene, className }) {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-black/50">
            <div className="text-white">Loading 3D Model...</div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onLoad={() => console.log("Spline scene loaded")}
          onError={(error) => console.error("Spline error:", error)}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
