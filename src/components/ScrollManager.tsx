import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollManager() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let frameId = 0;
    let attempts = 0;

    const findAndScroll = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView();
        return;
      }
      attempts += 1;
      if (attempts < 60) frameId = window.requestAnimationFrame(findAndScroll);
    };

    frameId = window.requestAnimationFrame(findAndScroll);
    return () => window.cancelAnimationFrame(frameId);
  }, [hash, pathname]);

  return null;
}
