"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterHydrationTask } from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger);

export function useSelectedWork(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    const cancelTask = afterHydrationTask(() => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 992px)",
          large: "(min-width: 1280px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (!context.conditions?.desktop || context.conditions.reduced) return;
          const heading = section.querySelector<HTMLElement>(".work-header h2");
          if (heading && context.conditions.large) {
            // Keep layout height stable while the heading shrinks on scroll.
            gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
              .fromTo(heading,
                { scale: 1, transformOrigin: "left center" },
                { scale: 70 / 195, duration: 16, ease: "power1.inOut" }, 20)
              .to({}, { duration: 64 }, 36);
          }
          gsap.from(section.querySelector(".work-header p"), {
            y: 100, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: section.querySelector(".work-header p"), start: "top 88%", once: true },
          });
          section.querySelectorAll<HTMLElement>(".work-item").forEach((item) => {
            gsap.from(item, {
              y: 100, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 88%", once: true },
            });
            gsap.from(item.querySelector(".work-title-motion"), {
              x: 30, duration: 0.8, delay: 0.3, ease: "power1.inOut",
              scrollTrigger: { trigger: item, start: "top bottom", once: true },
            });
            gsap.from(item.querySelector(".work-tag"), {
              yPercent: 50, opacity: 0, duration: 0.7, delay: 0.1, ease: "power1.inOut",
              scrollTrigger: { trigger: item.querySelector(".work-tag-wrap"), start: "top bottom", once: true },
            });
          });
        },
        section,
      );
    });
    return () => {
      disposed = true;
      cancelTask();
      media?.revert();
    };
  }, [ref]);
}

export function useProcessWall(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    const cancelTask = afterHydrationTask(() => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add(
        { desktop: "(min-width: 992px)", reduced: "(prefers-reduced-motion: reduce)" },
        (context) => {
          if (context.conditions?.reduced) return;
          gsap.from(section.querySelectorAll(".process-wall-heading > *"), {
            y: 32, opacity: 0, stagger: 0.12, duration: 0.75,
            scrollTrigger: { trigger: section, start: "top top", once: true },
          });
          if (!context.conditions?.desktop) return;
          const cards = section.querySelectorAll<HTMLElement>(".process-wall-card");
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.4, invalidateOnRefresh: true },
          });
          // Begin the reference's moving phase only after the section is pinned.
          const frames = [
            { from: 0, to: -50, start: 0, end: 32 },
            { from: 0, to: -50, start: 0, end: 40 },
            { from: 0, to: -100, start: 0, end: 30 },
            { from: 0, to: -100, start: 0, end: 22 },
            { from: 100, to: 0, start: 0, end: 42 },
            { from: 100, to: 0, start: 0, end: 27 },
            { from: 50, to: 0, start: 0, end: 36 },
            { from: 60, to: 0, start: 0, end: 25 },
          ];
          frames.forEach((frame, index) => {
            timeline.fromTo(cards[index], { y: `${frame.from}vh` }, {
              y: `${frame.to}vh`, duration: frame.end - frame.start,
            }, frame.start);
          });
          timeline.to({}, { duration: 30 }, 42);
        },
        section,
      );
    });
    return () => {
      disposed = true;
      cancelTask();
      media?.revert();
    };
  }, [ref]);
}

export function useTestimonialStack(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    const cancelTask = afterHydrationTask(() => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add(
        { desktop: "(min-width: 992px)", reduced: "(prefers-reduced-motion: reduce)" },
        (context) => {
          if (!context.conditions?.desktop || context.conditions.reduced) return;
          const cards = section.querySelectorAll<HTMLElement>(".testimonial-stack-item");
          gsap.set(cards, { y: "100vh" });
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
          });
          // Keep the stacking order, without consuming progress before arrival.
          timeline
            .to(cards[0], { y: 0, scale: 0.9, duration: 15 }, 0)
            .to(cards[1], { y: 0, scale: 0.95, duration: 15 }, 15)
            .to(cards[2], { y: 0, duration: 10 }, 30)
            .to({}, { duration: 30 }, 40);
        },
        section,
      );
    });
    return () => {
      disposed = true;
      cancelTask();
      media?.revert();
    };
  }, [ref]);
}
