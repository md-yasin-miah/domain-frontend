import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router keeps the same document when you navigate, so the browser does not
 * reset scroll like a full page load. Scroll the window (and any layout scroll
 * container marked with data-scroll-root) on location changes.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.querySelectorAll("[data-scroll-root]").forEach((el) => {
      if (el instanceof HTMLElement) {
        el.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;

