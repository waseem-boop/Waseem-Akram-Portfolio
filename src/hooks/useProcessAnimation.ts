"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  processRoute,
  processState,
  processStepReveal,
  processDrawingProgress,
  processScrollProgress,
} from "@/lib/processGeometry";
import {
  afterHydrationTask,
  scheduleScrollRefresh,
  whenFontsReady,
} from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger);

export function useProcessAnimation(ref: RefObject<HTMLElement | null>) {
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
          mobile:
            "(max-width: 900px) and (min-height: 481px), (max-width: 900px) and (orientation: portrait)",
          desktop:
            "(min-width: 901px), (max-width: 900px) and (max-height: 480px) and (orientation: landscape)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const mobile = Boolean(context.conditions?.mobile);
          const reduced = Boolean(context.conditions?.reduced);
          const diagram = section.querySelector<HTMLElement>(".process-diagram")!;
          const svg = section.querySelector<SVGSVGElement>(".process-curve")!;
          const path = svg.querySelector<SVGPathElement>(".process-curve-draw")!;
          const marker = section.querySelector<HTMLElement>(
            ".process-moving-dot",
          )!;
          const steps = Array.from(
            section.querySelectorAll<HTMLElement>(".process-step"),
          );
          const buttons = steps.map((step) =>
            step.querySelector<HTMLButtonElement>(".process-node")!,
          );
          const copies = steps.map((step) =>
            step.querySelector<HTMLElement>(".process-copy-reveal")!,
          );
          const indicator = section.querySelector<HTMLElement>(
            ".process-counter-current",
          )!;
          const announcement = section.querySelector<HTMLElement>(
            ".process-announcement",
          )!;
          const footer = section.querySelector<HTMLElement>(".process-footer")!;
          const titles = steps.map(
            (step) => step.querySelector("h3")!.textContent,
          );
          let length = 1;
          let checkpoints: number[] = [];
          let active = -2;
          let trigger: ScrollTrigger | undefined;
          let measuredKey = "";
          const drawing = { progress: reduced ? 1 : 0 };

          const measure = () => {
            const width = Math.max(1, diagram.clientWidth);
            const height = Math.max(1, diagram.clientHeight);
            const key = `${mobile ? "m" : "d"}:${width}x${height}`;
            if (key === measuredKey) return;
            measuredKey = key;
            // Match SVG units to CSS pixels. Non-scaling strokes combined with
            // stretched native-unit dash lengths left the previous line incomplete.
            const route = processRoute(
              mobile ? "mobile" : "desktop",
              width,
              height,
            );
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            path.setAttribute("d", route.path);
            length = path.getTotalLength() || 1;
            const probe = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path",
            );
            probe.style.visibility = "hidden";
            svg.appendChild(probe);
            checkpoints = route.checkpoints.map((prefix) => {
              probe.setAttribute("d", prefix);
              return probe.getTotalLength() / length;
            });
            probe.remove();
          };

          const render = () => {
            const progress = reduced
              ? 1
              : processDrawingProgress(drawing.progress);
            path.style.strokeDashoffset = String(1 - progress);
            path.style.visibility = progress > 0 ? "visible" : "hidden";
            footer.style.opacity = String(Math.min(1, progress / 0.04));
            footer.style.visibility = progress > 0 ? "visible" : "hidden";
            const point = path.getPointAtLength(length * progress);
            marker.style.left = `${point.x}px`;
            marker.style.top = `${point.y}px`;
            marker.style.opacity =
              !reduced && progress > 0.002 && progress < 0.998 ? "1" : "0";
            steps.forEach((step, index) => {
              const reveal = processStepReveal(
                progress,
                checkpoints[index],
                checkpoints[index + 1] ?? 1,
              );
              const node = reduced ? 1 : reveal.node;
              const copy = reduced ? 1 : reveal.copy;
              buttons[index].style.opacity = String(node);
              buttons[index].style.visibility =
                node > 0.001 ? "visible" : "hidden";
              buttons[index].style.transform =
                `translateY(${(1 - node) * 12}px) scale(${0.75 + node * 0.25})`;
              buttons[index].disabled = reduced || node < 0.98;
              copies[index].style.opacity = String(copy);
              copies[index].style.visibility =
                copy > 0.001 ? "visible" : "hidden";
              copies[index].style.transform = `translateY(${(1 - copy) * 22}px)`;
            });
            const state = processState(progress, checkpoints);
            if (state.active === active) return;
            active = state.active;
            steps.forEach((step, index) => {
              step.dataset.state =
                index < active || reduced
                  ? "complete"
                  : index === active
                    ? "active"
                    : "upcoming";
              if (index === active)
                buttons[index].setAttribute("aria-current", "step");
              else buttons[index].removeAttribute("aria-current");
            });
            indicator.textContent = String(state.completed).padStart(2, "0");
            announcement.textContent =
              active < 0 ? "" : `Step ${active + 1} of 4: ${titles[active]}`;
          };

          section.dataset.processMotion = reduced ? "reduced" : "active";
          measure();
          render();
          if (!reduced) {
            const tween = gsap.fromTo(
              drawing,
              { progress: 0 },
              {
                progress: 1,
                ease: "none",
                onUpdate: render,
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                  onRefresh: () => {
                    measure();
                    render();
                  },
                },
              },
            );
            trigger = tween.scrollTrigger;
          }
          const cleanupButtons = buttons.map((button, index) => {
            const jump = () => {
              if (!trigger) return;
              const target = processScrollProgress(
                Math.min(1, checkpoints[index] + 0.07),
              );
              window.scrollTo({
                top: trigger.start + target * (trigger.end - trigger.start),
                behavior: "smooth",
              });
            };
            button.addEventListener("click", jump);
            return () => button.removeEventListener("click", jump);
          });
          let width = diagram.clientWidth;
          let height = diagram.clientHeight;
          const resize = new ResizeObserver(() => {
            if (width === diagram.clientWidth && height === diagram.clientHeight)
              return;
            width = diagram.clientWidth;
            height = diagram.clientHeight;
            scheduleScrollRefresh();
          });
          resize.observe(diagram);
          scheduleScrollRefresh();
          return () => {
            resize.disconnect();
            cleanupButtons.forEach((cleanup) => cleanup());
            section.dataset.processMotion = "pending";
          };
        },
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
