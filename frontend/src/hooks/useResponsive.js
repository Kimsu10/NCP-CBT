import { debounce } from "lodash";
import { useState, useEffect } from "react";

const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  };

  const isMobile = windowWidth < BREAKPOINTS.mobile;
  const isTablet =
    windowWidth >= BREAKPOINTS.mobile && windowWidth < BREAKPOINTS.tablet;
  const isDesktop = windowWidth >= BREAKPOINTS.tablet;

  const getDeviceType = () => {
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "desktop";
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResize);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    getDeviceType,
    breakpoints: BREAKPOINTS,
  };
};

export default useResponsive;
