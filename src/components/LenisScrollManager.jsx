import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis, initLenis, syncLenisForRoute } from "../lib/lenis";

/** Keeps Lenis in sync with route, resize, and DOM changes (e.g. Google Translate). */
const LenisScrollManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    initLenis();
    syncLenisForRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    let resizeTimer;
    const resize = () => lenis.resize();
    window.addEventListener("load", resize);
    const observer = new MutationObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => requestAnimationFrame(resize), 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("load", resize);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default LenisScrollManager;
