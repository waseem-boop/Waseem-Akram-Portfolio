"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { createStatementDraft } from "@/lib/statementDraft";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({ nullTargetWarn: false });

export function useStatementAnimation(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    const screen = section.querySelector<HTMLElement>(".statement-section");
    if (!screen) return;
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    let refreshFrame = 0;

    const start = () => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add(
        {
          phone: "(max-width: 767px)",
          wide: "(min-width: 768px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const paragraphs = Array.from(
            section.querySelectorAll<HTMLElement>(".statement-text"),
          );
          if (context.conditions?.reduced) {
            screen.dataset.motion = "reduced";
            gsap.set(paragraphs, { opacity: 1 });
            const draft = createStatementDraft(screen);
            draft.render(1);
            return () => {
              draft.destroy();
              delete screen.dataset.motion;
            };
          }
          const draft = createStatementDraft(screen);
          const splits = paragraphs.map((paragraph) =>
            SplitText.create(paragraph, {
              type: "lines",
              linesClass: "statement-line",
              ignore: ".statement-period",
            }),
          );
          gsap.set(paragraphs, { opacity: 1 });
          screen.dataset.motion = "active";
          const travel = context.conditions?.phone ? 0.34 : 0.58;
          const scrollDuration =
            0.12 + (splits.length - 1) + (splits.length - 2) * 0.12 + 0.12;
          section.style.setProperty("--statement-travel", scrollDuration * travel * 100 + "vh");
          const timeline = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 1 },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${scrollDuration * travel * window.innerHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          splits.forEach((split, index) => {
            gsap.set(split.lines, {
              transformOrigin: "50% 50% -620px",
              rotationY: index === 0 ? 0 : 105,
            });
            if (index > 0)
              timeline
                .to(
                  splits[index - 1].lines,
                  { rotationY: -105, stagger: 0.12 },
                  index === 1 ? 0.12 : "+=0.12",
                )
                .to(split.lines, { rotationY: 0, stagger: 0.12 }, "<");
          });
          timeline.to({}, { duration: 0.3 });

          const drawing = { progress: 0 };
          gsap.to(drawing, {
            progress: 1,
            ease: "none",
            onUpdate: () => draft.render(drawing.progress),
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "+=150%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          const layout = () => draft.rebuild();
          ScrollTrigger.addEventListener("refreshInit", layout);
          let previousWidth = section.clientWidth;
          let timer: ReturnType<typeof setTimeout> | undefined;
          const resize = new ResizeObserver(() => {
            if (section.clientWidth === previousWidth) return;
            previousWidth = section.clientWidth;
            clearTimeout(timer);
            timer = setTimeout(() => {
              media?.revert();
              start();
            }, 150);
          });
          resize.observe(section);
          refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

          return () => {
            clearTimeout(timer);
            resize.disconnect();
            ScrollTrigger.removeEventListener("refreshInit", layout);
            splits.forEach((split) => split.revert());
            draft.destroy();
            delete screen.dataset.motion;
            section.style.removeProperty("--statement-travel");
          };
        },
      );
    };

    void document.fonts.ready.then(start);
    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      media?.revert();
    };
  }, [ref]);
}
