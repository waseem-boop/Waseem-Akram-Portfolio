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

export function useServiceShowcase(ref: RefObject<HTMLElement | null>) {
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
          if (context.conditions?.reduced) return;
          const title = section.querySelector(".showcase-heading");
          const introduction = section.querySelector(".showcase-introduction");
          gsap.fromTo(
            title,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: title, start: "top 92%", once: true },
            },
          );
          gsap.fromTo(
            introduction,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: introduction,
                start: "top 95%",
                once: true,
              },
            },
          );
          if (!context.conditions?.desktop) return;

          const track = section.querySelector<HTMLElement>(".showcase-track")!;
          const cards = Array.from(
            section.querySelectorAll<HTMLElement>(".showcase-card"),
          );
          const figures = cards.map((card) =>
            card.querySelector(".showcase-figure"),
          );
          const images = cards.map((card) =>
            card.querySelector(".showcase-figure img"),
          );
          const headings = cards.map((card) => card.querySelector("h3"));
          const descriptions = cards.map((card) =>
            card.querySelector(".showcase-description"),
          );
          const paragraphs = cards.map((card) => card.querySelector("p")!);

          // Batch all layout reads BEFORE GSAP style writes to avoid forced reflows.
          const measure = () => {
            const width = section.clientWidth;
            const last = cards[cards.length - 1];
            return {
              startX: width * 0.59,
              endX: (width - last.offsetWidth) / 2 - last.offsetLeft,
              openHeights: paragraphs.map((p) => Math.max(100, p.scrollHeight)),
            };
          };
          let metrics = measure();

          gsap.set(figures[0], { xPercent: -48, yPercent: -70 });
          gsap.set(images[0], { scale: 2.2 });
          gsap.set(headings[1], { y: 19 });
          gsap.set(headings[2], { y: 12 });
          gsap.set(descriptions[0], {
            height: () => metrics.openHeights[0],
            opacity: 1,
          });
          gsap.set([descriptions[1], descriptions[2]], {
            height: 0,
            opacity: 0,
          });

          const onRefreshInit = () => {
            metrics = measure();
          };
          ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

          // Original Regensia keyframes: travel 25-85; sculpture reveals 38/59/85.
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              track,
              { x: () => metrics.startX },
              { x: () => metrics.endX, duration: 60 },
              25,
            )
            .to(figures[0], { xPercent: 0, yPercent: 0, duration: 10 }, 38)
            .to(images[0], { scale: 1, duration: 10 }, 38)
            .to(descriptions[0], { opacity: 0, duration: 7 }, 38)
            .to(descriptions[0], { height: 0, duration: 10 }, 38)
            .to(headings[0], { y: 10, duration: 3 }, 45)
            .to(
              descriptions[1],
              { height: () => metrics.openHeights[1], opacity: 1, duration: 3 },
              56,
            )
            .to(figures[1], { xPercent: -24, yPercent: -70, duration: 3 }, 56)
            .to(images[1], { scale: 3, duration: 3 }, 56)
            .to(headings[1], { y: 0, duration: 3 }, 56)
            .to(images[1], { scale: 2.5, duration: 3 }, 59)
            .to(headings[1], { y: 19, duration: 6 }, 62)
            .to(descriptions[1], { opacity: 0, duration: 4 }, 65)
            .to(descriptions[1], { height: 0, duration: 8 }, 62)
            .to(figures[1], { xPercent: 0, yPercent: 0, duration: 8 }, 62)
            .to(images[1], { scale: 1, duration: 8 }, 62)
            .to(figures[2], { xPercent: -32, yPercent: -75, duration: 4 }, 79)
            .to(images[2], { scale: 2.2, duration: 4 }, 79)
            .to(
              descriptions[2],
              { height: () => metrics.openHeights[2], duration: 4 },
              79,
            )
            .to(headings[2], { y: 10, duration: 4 }, 79)
            .to(descriptions[2], { opacity: 1, duration: 2 }, 83)
            .to({}, { duration: 15 }, 85);

          // Complete the scrub before a keyboard-focused card is used.
          const focusCard = (event: FocusEvent) => {
            const index = cards.findIndex((card) =>
              card.contains(event.target as Node),
            );
            const trigger = timeline.scrollTrigger;
            if (index < 0 || !trigger) return;
            const progress = [0.38, 0.6, 0.86][index];
            trigger.scroll(
              trigger.start + (trigger.end - trigger.start) * progress,
            );
          };
          section.addEventListener("focusin", focusCard);
          return () => {
            ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
            section.removeEventListener("focusin", focusCard);
          };
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
