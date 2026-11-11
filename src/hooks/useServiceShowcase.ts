"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useServiceShowcase(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    const media = gsap.matchMedia();
    let disposed = false;

    media.add(
      { desktop: "(min-width: 992px)", reduced: "(prefers-reduced-motion: reduce)" },
      (context) => {
        if (context.conditions?.reduced) return;
        const title = section.querySelector(".showcase-heading");
        const introduction = section.querySelector(".showcase-introduction");
        gsap.fromTo(title, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 92%", once: true },
        });
        gsap.fromTo(introduction, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: introduction, start: "top 95%", once: true },
        });
        if (!context.conditions?.desktop) return;

        const track = section.querySelector<HTMLElement>(".showcase-track")!;
        const cards = Array.from(section.querySelectorAll<HTMLElement>(".showcase-card"));
        const figures = cards.map((card) => card.querySelector(".showcase-figure"));
        const images = cards.map((card) => card.querySelector(".showcase-figure img"));
        const headings = cards.map((card) => card.querySelector("h3"));
        const descriptions = cards.map((card) => card.querySelector(".showcase-description"));

        const startX = () => section.clientWidth * 0.59;
        const endX = () => {
          const last = cards[cards.length - 1];
          return (section.clientWidth - last.offsetWidth) / 2 - last.offsetLeft;
        };
        const openHeight = (index: number) => Math.max(100,
          cards[index].querySelector("p")!.scrollHeight,
        );

        gsap.set(figures[0], { xPercent: -48, yPercent: -70 });
        gsap.set(images[0], { scale: 2.2 });
        gsap.set(headings[1], { y: 19 });
        gsap.set(headings[2], { y: 12 });
        gsap.set(descriptions[0], { height: () => openHeight(0), opacity: 1 });
        gsap.set([descriptions[1], descriptions[2]], { height: 0, opacity: 0 });

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
          .fromTo(track, { x: startX }, { x: endX, duration: 60 }, 25)
          .to(figures[0], { xPercent: 0, yPercent: 0, duration: 10 }, 38)
          .to(images[0], { scale: 1, duration: 10 }, 38)
          .to(descriptions[0], { opacity: 0, duration: 7 }, 38)
          .to(descriptions[0], { height: 0, duration: 10 }, 38)
          .to(headings[0], { y: 10, duration: 3 }, 45)
          .to(descriptions[1], { height: () => openHeight(1), opacity: 1, duration: 3 }, 56)
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
          .to(descriptions[2], { height: () => openHeight(2), duration: 4 }, 79)
          .to(headings[2], { y: 10, duration: 4 }, 79)
          .to(descriptions[2], { opacity: 1, duration: 2 }, 83)
          .to({}, { duration: 15 }, 85);

        // Complete the scrub before a keyboard-focused card is used.
        const focusCard = (event: FocusEvent) => {
          const index = cards.findIndex((card) => card.contains(event.target as Node));
          const trigger = timeline.scrollTrigger;
          if (index < 0 || !trigger) return;
          const progress = [0.38, 0.60, 0.86][index];
          trigger.scroll(trigger.start + (trigger.end - trigger.start) * progress);
        };
        section.addEventListener("focusin", focusCard);
        return () => section.removeEventListener("focusin", focusCard);
      },
      section,
    );
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      media.revert();
    };
  }, [ref]);
}
