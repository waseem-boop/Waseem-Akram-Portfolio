"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup: (() => void) | undefined;

    const setup = () => {
      cleanup?.();
      cleanup = undefined;
      if (motion.matches) return;

      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: true,
        infinite: Boolean(document.querySelector("[data-loop-return]")),
        anchors: { offset: -24 },
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      // Refresh geometry without resetting the in-flight animation or emitting
      // another scroll event from inside ScrollTrigger's refresh cycle.
      const resize = () => lenis.dimensions.resize();
      let previousScroll = window.scrollY;
      const update = () => {
        const currentScroll = window.scrollY;
        // Announce only the actual end-to-start crossing. No scroll writes,
        // animation completion or refresh calls belong in this event.
        if (previousScroll > lenis.limit - window.innerHeight &&
            currentScroll < window.innerHeight &&
            previousScroll - currentScroll > window.innerHeight * 2) {
          window.dispatchEvent(new Event("portfolio:hero-return"));
        }
        previousScroll = currentScroll;
        ScrollTrigger.update();
      };
      lenis.on("scroll", update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener("refresh", resize);

      // Match the navigation's existing body scroll lock, including inertia.
      const header = document.querySelector(".site-header");
      const syncMenu = () => {
        if (header?.getAttribute("data-open") === "true") lenis.stop();
        else lenis.start();
      };
      const observer = new MutationObserver(syncMenu);
      if (header) observer.observe(header, { attributes: true, attributeFilter: ["data-open"] });
      syncMenu();

      cleanup = () => {
        observer.disconnect();
        ScrollTrigger.removeEventListener("refresh", resize);
        gsap.ticker.remove(tick);
        lenis.off("scroll", update);
        lenis.destroy();
      };
    };

    setup();
    motion.addEventListener("change", setup);
    return () => {
      motion.removeEventListener("change", setup);
      cleanup?.();
    };
  }, []);

  return null;
}
