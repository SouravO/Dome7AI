// Optimization wrapper for ModeViewer to handle low-end devices
import React, { useMemo } from 'react';
import { getAnimationConfig } from '../utils/performanceOptimizations';

export const OptimizedModelViewer = (props) => {
  const { isSlowDevice } = getAnimationConfig();
  
  // Reduce quality settings for slow devices
  const optimizedProps = useMemo(() => {
    if (isSlowDevice) {
      return {
        ...props,
        enableMouseParallax: false,
        enableHoverRotation: false,
        autoRotate: false,
        ambientIntensity: 0.3,
        keyLightIntensity: 0.8,
        fillLightIntensity: 0.3,
        rimLightIntensity: 0.4,
      };
    }
    return props;
  }, [isSlowDevice, props]);

  return <ModeViewer {...optimizedProps} />;
};

// Import the actual ModeViewer
import ModeViewer from './ModeViewer';

export default OptimizedModelViewer;
