// Performance Optimization utilities

// 1. Reduce animations on low-end devices
export const getAnimationConfig = () => {
  // Check if device is low-end based on connection speed
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === '3g';
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  return {
    isSlowDevice: isSlowConnection || prefersReducedMotion,
    duration: isSlowConnection || prefersReducedMotion ? 0.3 : 0.8,
    animationEnabled: !prefersReducedMotion,
  };
};

// 2. Debounce function for scroll events
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 3. Throttle function for frequently called functions
export const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

// 4. Disable non-critical animations on low-end devices
export const shouldReduceAnimations = () => {
  const config = getAnimationConfig();
  return config.isSlowDevice;
};

// 5. Optimize localStorage usage
export const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage not available', e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage not available', e);
    }
  }
};

export default {
  getAnimationConfig,
  debounce,
  throttle,
  shouldReduceAnimations,
  safeLocalStorage,
};
