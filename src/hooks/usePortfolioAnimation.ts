"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolio } from "@/data/portfolio";
import {
  drawnAtSectionReach,
  projectThread,
  sampleReach,
  type ProjectBox,
  type ReachSample,
} from "@/lib/portfolioGeometry";
import { scheduleScrollRefresh, whenFontsReady } from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger);

// Offset coordinates intentionally ignore the cards' parallax transforms.
function layoutBox(element: HTMLElement, parent: HTMLElement): ProjectBox {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = element;
  while (current && current !== parent) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
    if (current && !parent.contains(current)) break;
  }
  return { x, y, w: element.offsetWidth, h: element.offsetHeight };
}

export function usePortfolioAnimation(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let disposed = false;
    const media = gsap.matchMedia();
    const initialize = () => {
      if (disposed) return;
      media.add(
        {
          desktop: "(min-width: 1024px)",
          small: "(max-width: 1023px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const stage = section.querySelector<HTMLElement>(".portfolio-stage")!;
          const grid = section.querySelector<HTMLElement>(".portfolio-grid")!;
          const items = Array.from(
            grid.querySelectorAll<HTMLElement>(".portfolio-item"),
          );
          const svg = stage.querySelector<SVGSVGElement>(".portfolio-thread")!;
          const path = svg.querySelector<SVGPathElement>("path")!;
          const reduced = Boolean(context.conditions?.reduced);
          const drawing = { drawn: 0 };
          let length = 0;
          let completionReach = 0;
          let samples: ReachSample[] = [];
          let builtKey = "";
          const render = () => {
            path.style.strokeDasharray = `${drawing.drawn} ${length + 1}`;
            path.style.visibility = drawing.drawn > 0.5 ? "visible" : "hidden";
          };
          const build = () => {
            const width = stage.clientWidth;
            const stageBounds = stage.getBoundingClientRect();
            const height = Math.max(
              stage.clientHeight,
              section.getBoundingClientRect().bottom - stageBounds.top,
            );
            const key = `${width}x${Math.round(height)}`;
            if (key === builtKey && length > 0) return;
            builtKey = key;
            completionReach = height - 0.34 * window.innerHeight;
            const stroke = Math.min(
              40,
              Math.max(16, window.innerWidth * 0.022),
            );
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svg.style.height = `${height}px`;
            path.style.strokeWidth = `${stroke}px`;
            const geometry = projectThread(
              items.map((item) => layoutBox(item, stage)),
              width,
              height,
              stroke,
            );
            path.setAttribute("d", geometry.path);
            length = path.getTotalLength();
            samples = sampleReach(geometry.segments, length);
            if (reduced) drawing.drawn = length;
            render();
          };
          build();
          if (!reduced && context.conditions?.desktop) {
            items.forEach((item, index) =>
              gsap.fromTo(
                item,
                { yPercent: portfolio.featured[index].parallax },
                {
                  yPercent: -portfolio.featured[index].parallax,
                  ease: "none",
                  scrollTrigger: {
                    trigger: grid,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              ),
            );
          }
          const follow = gsap.quickTo(drawing, "drawn", {
            duration: 0.7,
            ease: "power2.out",
            onUpdate: render,
          });
          const update = () => {
            const reach =
              0.66 * window.innerHeight - stage.getBoundingClientRect().top;
            follow(
              drawnAtSectionReach(samples, reach, length, completionReach),
            );
          };
          if (!reduced) {
            ScrollTrigger.create({
              trigger: stage,
              start: "top bottom",
              endTrigger: section,
              end: "bottom bottom",
              onUpdate: update,
              onRefresh: update,
              onLeave: () => follow(length),
              invalidateOnRefresh: true,
            });
            update();
          }
          ScrollTrigger.addEventListener("refreshInit", build);
          let previousWidth = section.clientWidth;
          let previousHeight = section.clientHeight;
          const observer = new ResizeObserver(() => {
            if (
              section.clientWidth === previousWidth &&
              section.clientHeight === previousHeight
            )
              return;
            previousWidth = section.clientWidth;
            previousHeight = section.clientHeight;
            scheduleScrollRefresh();
          });
          observer.observe(section);
          scheduleScrollRefresh();
          return () => {
            follow.tween.kill();
            observer.disconnect();
            ScrollTrigger.removeEventListener("refreshInit", build);
          };
        },
      );
    };
    const cancelFonts = whenFontsReady(initialize);
    return () => {
      disposed = true;
      cancelFonts();
      media.revert();
    };
  }, [ref]);
}
