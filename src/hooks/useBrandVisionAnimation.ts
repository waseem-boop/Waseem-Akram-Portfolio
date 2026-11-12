"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  afterHydrationTask,
  scheduleScrollRefresh,
  whenFontsReady,
} from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger);

export function useBrandVisionAnimation(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    let cancelFonts = () => {};

    const cancelTask = afterHydrationTask(() => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 992px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (!context.conditions?.desktop || context.conditions.reduced) return;
          const cards = ["01", "02", "03", "04"].map(
            (number) =>
              section.querySelector<HTMLElement>(
                `[data-vision-card="${number}"]`,
              )!,
          );
          const messages =
            section.querySelectorAll<HTMLElement>(".vision-message");
          const innerRing = section.querySelector(".vision-ring-inner");
          const outerRing = section.querySelector(".vision-ring-outer");
          gsap.set(cards, { y: (index) => `${index === 3 ? 100 : 120}vh` });
          gsap.set([innerRing, outerRing], { scale: 0, opacity: 0 });
          gsap.set(messages, { opacity: (index) => (index === 0 ? 1 : 0) });

          // Positions use the original reference's 0-100 scroll keyframes.
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(innerRing, { scale: 1, duration: 25 }, 0)
            .to(innerRing, { opacity: 1, duration: 10 }, 15)
            .to(outerRing, { scale: 1, duration: 20 }, 25)
            .to(outerRing, { opacity: 1, duration: 17 }, 28)
            .to(cards[0], { y: 0, duration: 60 }, 0)
            .to(cards[1], { y: 0, duration: 45 }, 25)
            .to(cards[2], { y: "1vh", duration: 19 }, 53)
            .to(cards[3], { y: 0, duration: 29 }, 53)
            .to(messages[0], { opacity: 0, duration: 1 }, 50)
            .to(messages[1], { opacity: 1, duration: 1 }, 50)
            .to(messages[1], { opacity: 0, duration: 1 }, 70)
            .to(messages[2], { opacity: 1, duration: 1 }, 70)
            .to({}, { duration: 18 }, 82);

          // Keyboard focus must not leave a scrolled-off card inaccessible.
          const onFocus = () => timeline.scrollTrigger?.getTween()?.progress(1);
          section.addEventListener("focusin", onFocus);
          return () => section.removeEventListener("focusin", onFocus);
        },
        section,
      );
      cancelFonts = whenFontsReady(scheduleScrollRefresh);
    });

    return () => {
      disposed = true;
      cancelTask();
      cancelFonts();
      media?.revert();
    };
  }, [ref]);
}
