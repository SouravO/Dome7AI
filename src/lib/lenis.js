import Lenis from "lenis";

let lenisInstance = null;

const LENIS_DISABLED_PREFIXES = ["/console", "/shared"];

export const isLenisDisabledRoute = (pathname) =>
  LENIS_DISABLED_PREFIXES.some((p) => pathname.startsWith(p));

export const initLenis = () => {
  if (lenisInstance || typeof window === "undefined") return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    autoRaf: false,
  });

  const raf = (time) => {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  const onResize = () => lenisInstance?.resize();
  window.addEventListener("resize", onResize, { passive: true });

  return lenisInstance;
};

export const getLenis = () => lenisInstance;

export const syncLenisForRoute = (pathname) => {
  const lenis = initLenis();
  if (!lenis) return;

  if (isLenisDisabledRoute(pathname)) {
    lenis.stop();
    document.documentElement.classList.remove("lenis-scrolling");
  } else {
    lenis.start();
    requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
    });
  }
};

/** Scroll to element or y offset; uses Lenis when active. */
export const scrollToTarget = (target, { offset = -80, immediate = false } = {}) => {
  const lenis = getLenis();

  if (lenis && !lenis.isStopped) {
    lenis.scrollTo(target, { offset, immediate });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
    return;
  }

  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (el) target = el;
  }

  if (target?.scrollIntoView) {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
};
