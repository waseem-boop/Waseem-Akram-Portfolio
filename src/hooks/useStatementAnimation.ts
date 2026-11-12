"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { createStatementDraft } from "@/lib/statementDraft";
import {
  afterHydrationTask,
  scheduleScrollRefresh,
  whenFontsReady,
} from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({ nullTargetWarn: false });

export function useStatementAnimation(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const screen = section.querySelector<HTMLElement>(".statement-section");
    if (!screen) return;
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    let cancelStep = () => {};

    const start = () => {
      if (disposed) return;
      cancelStep();
      media?.revert();
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

          let active = true;
          let draft: ReturnType<typeof createStatementDraft> | undefined;
          let resize: ResizeObserver | undefined;
          let timer: ReturnType<typeof setTimeout> | undefined;
          let layout = () => {};
          const splits: SplitText[] = [];

          const finishSetup = () => {
            if (!active || disposed) return;
            gsap.set(paragraphs, { opacity: 1 });
            screen.dataset.motion = "active";
            draft = createStatementDraft(screen);
            const travel = context.conditions?.phone ? 0.34 : 0.58;
            const scrollDuration =
              0.12 + (splits.length - 1) + (splits.length - 2) * 0.12 + 0.12;
            section.style.setProperty(
              "--statement-travel",
              scrollDuration * travel * 100 + "vh",
            );
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
              onUpdate: () => draft?.render(drawing.progress),
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "+=150%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            layout = () => draft?.rebuild();
            ScrollTrigger.addEventListener("refreshInit", layout);
            let previousWidth = section.clientWidth;
            resize = new ResizeObserver(() => {
              if (section.clientWidth === previousWidth) return;
              previousWidth = section.clientWidth;
              clearTimeout(timer);
              timer = setTimeout(() => {
                if (!disposed) start();
              }, 150);
            });
            resize.observe(section);
            scheduleScrollRefresh();
          };

          const splitNext = (index: number) => {
            if (!active || disposed) return;
            if (index >= paragraphs.length) {
              cancelStep = afterHydrationTask(finishSetup);
              return;
            }
            splits.push(
              SplitText.create(paragraphs[index], {
                type: "lines",
                linesClass: "statement-line",
                ignore: ".statement-period",
              }),
            );
            cancelStep = afterHydrationTask(() => splitNext(index + 1));
          };

          splitNext(0);

          return () => {
            active = false;
            cancelStep();
            clearTimeout(timer);
            resize?.disconnect();
            ScrollTrigger.removeEventListener("refreshInit", layout);
            splits.forEach((split) => split.revert());
            draft?.destroy();
            delete screen.dataset.motion;
            section.style.removeProperty("--statement-travel");
          };
        },
      );
    };

    const cancelFonts = whenFontsReady(start);
    return () => {
      disposed = true;
      cancelFonts();
      cancelStep();
      media?.revert();
    };
  }, [ref]);
}
