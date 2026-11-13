"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterHydrationTask } from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup: (() => void) | undefined;
    let cancelTask = () => {};
    let disposed = false;

    const setup = () => {
      cleanup?.();
      cleanup = undefined;
      if (motion.matches) return;

      const isHomeLoop =
        pathname === "/" && Boolean(document.querySelector("[data-loop-return]"));
      const hero = isHomeLoop ? document.getElementById("hero") : null;

      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: true,
        infinite: isHomeLoop,
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
        if (hero && previousScroll > lenis.limit - window.innerHeight &&
            currentScroll < window.innerHeight &&
            previousScroll - currentScroll > window.innerHeight * 2) {
          hero.setAttribute("data-returned", "");
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
        hero?.removeAttribute("data-returned");
        observer.disconnect();
        ScrollTrigger.removeEventListener("refresh", resize);
        gsap.ticker.remove(tick);
        lenis.off("scroll", update);
        lenis.destroy();
      };
    };

    const scheduleSetup = () => {
      cancelTask();
      cancelTask = afterHydrationTask(() => {
        if (!disposed) setup();
      });
    };

    scheduleSetup();
    motion.addEventListener("change", scheduleSetup);
    return () => {
      disposed = true;
      cancelTask();
      motion.removeEventListener("change", scheduleSetup);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
