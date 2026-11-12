"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenFontsReady } from "@/lib/motionScheduler";

gsap.registerPlugin(ScrollTrigger);
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export default function DotTransition() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    const media = gsap.matchMedia();
    let measureCtx: CanvasRenderingContext2D | null = null;
    const cancelFonts = whenFontsReady(() => {
      if (disposed) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const passage = ref.current;
        const scene = passage?.querySelector<HTMLElement>(".dot-scene");
        const svg = passage?.querySelector<SVGSVGElement>(".dot-scene-svg");
        const circle = passage?.querySelector<SVGCircleElement>(".dot-scene-circle");
        const source = document.querySelector<HTMLElement>("#about .statement-section");
        if (!passage || !scene || !svg || !circle || !source) return;
        let cachedKey = "";
        let geometry: { period: HTMLElement; x: number; y: number; radius: number; width: number; height: number; cover: number };
        const measure = () => {
          const width = scene.clientWidth, height = scene.clientHeight;
          const sw = source.clientWidth, sh = source.clientHeight;
          const lines = source.querySelectorAll<HTMLElement>(".statement-line");
          const key = `${width}x${height}:${sw}x${sh}:${lines.length}`;
          if (key === cachedKey && geometry) return geometry;
          cachedKey = key;
          const period = Array.from(source.querySelectorAll<HTMLElement>(".statement-period")).find(p => p.textContent === ".")!;
          const saved = Array.from(lines, line => line.style.transform);
          lines.forEach(line => { line.style.transform = "none"; });
          const origin = source.getBoundingClientRect();
          const bounds = period.getBoundingClientRect();
          const style = getComputedStyle(period);
          measureCtx ??= document.createElement("canvas").getContext("2d");
          const ctx = measureCtx!;
          ctx.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
          const m = ctx.measureText(".");
          const radius = Math.max(2, (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 2);
          const baseline = (parseFloat(style.lineHeight) - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
          const x = bounds.left - origin.left + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
          const y = bounds.top - origin.top + baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
          lines.forEach((line, i) => { line.style.transform = saved[i]; });
          svg.setAttribute("viewBox", "0 0 " + width + " " + height);
          geometry = { period, x, y, radius, width, height, cover: Math.hypot(width, height) / 2 + 2 };
          return geometry;
        };
        geometry = measure();
        let lastProgress = -1;
        const paint = (progress: number) => {
          if (progress <= 0 && lastProgress === 0) return;
          lastProgress = progress;
          const { x, y, radius, width, height, cover } = geometry;
          if (progress <= 0) {
            svg.style.opacity = "0";
            geometry.period.style.opacity = "1";
            scene.dataset.arrived = "false";
            return;
          }
          const transfer = clamp(progress * 2);
          const grow = clamp((progress - 0.56) / 0.44);
          const expansion = grow * grow * (3 - 2 * grow);
          // Initially leave products diagonally down-left. As the new viewport
          // rises underneath, carry the dot into its centre before growing it.
          const screenY = mix(y, height / 2, transfer) + Math.sin(Math.PI * transfer) * height * 0.35;
          const localY = transfer < 1 ? screenY - scene.getBoundingClientRect().top : height / 2;
          circle.setAttribute("cx", String(mix(x, width / 2, transfer)));
          circle.setAttribute("cy", String(localY));
          // Change the vector radius itself: never enlarge a rasterized dot.
          circle.setAttribute("r", String(mix(radius, cover, expansion)));
          svg.style.opacity = "1";
          geometry.period.style.opacity = "0";
          scene.dataset.arrived = String(transfer === 1);
        };
        const trigger = ScrollTrigger.create({
          trigger: passage, start: "top bottom", end: "bottom bottom",
          onUpdate: self => paint(self.progress),
          onRefresh: self => { geometry = measure(); lastProgress = -1; paint(self.progress); },
        });
        paint(trigger.progress);
        return () => {
          geometry.period.style.opacity = "";
          svg.style.opacity = "0";
          delete scene.dataset.arrived;
        };
      }, ref);
    });
    return () => { disposed = true; cancelFonts(); media.revert(); };
  }, []);
  return <div ref={ref} className="dot-passage" aria-hidden="true">
    <div className="dot-scene">
      <svg className="dot-scene-svg" width="100%" height="100%" focusable="false">
        <circle className="dot-scene-circle" cx="0" cy="0" r="0" fill="#0B2D26" />
      </svg>
    </div>
  </div>;
}
