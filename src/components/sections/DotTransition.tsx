"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export default function DotTransition() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let disposed = false;
    const media = gsap.matchMedia();
    void document.fonts.ready.then(() => {
      if (disposed) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const passage = ref.current;
        const scene = passage?.querySelector<HTMLElement>(".dot-scene");
        const svg = passage?.querySelector<SVGSVGElement>(".dot-scene-svg");
        const circle = passage?.querySelector<SVGCircleElement>(".dot-scene-circle");
        const source = document.querySelector<HTMLElement>("#about .statement-section");
        if (!passage || !scene || !svg || !circle || !source) return;
        const measure = () => {
          const period = Array.from(source.querySelectorAll<HTMLElement>(".statement-period")).find(p => p.textContent === ".")!;
          const lines = source.querySelectorAll<HTMLElement>(".statement-line");
          const saved = Array.from(lines, line => line.style.transform);
          lines.forEach(line => { line.style.transform = "none"; });
          const origin = source.getBoundingClientRect();
          const bounds = period.getBoundingClientRect();
          const style = getComputedStyle(period);
          const ctx = document.createElement("canvas").getContext("2d")!;
          ctx.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
          const m = ctx.measureText(".");
          const radius = Math.max(2, (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 2);
          const baseline = (parseFloat(style.lineHeight) - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
          const x = bounds.left - origin.left + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
          const y = bounds.top - origin.top + baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
          lines.forEach((line, i) => { line.style.transform = saved[i]; });
          const width = scene.clientWidth, height = scene.clientHeight;
          svg.setAttribute("viewBox", "0 0 " + width + " " + height);
          return { period, x, y, radius, width, height, cover: Math.hypot(width, height) / 2 + 2 };
        };
        let geometry = measure();
        const paint = (progress: number) => {
          const { x, y, radius, width, height, cover } = geometry;
          const transfer = clamp(progress * 2);
          const grow = clamp((progress - 0.56) / 0.44);
          const expansion = grow * grow * (3 - 2 * grow);
          const sceneTop = scene.getBoundingClientRect().top;
          // Initially leave products diagonally down-left. As the new viewport
          // rises underneath, carry the dot into its centre before growing it.
          const screenY = mix(y, height / 2, transfer) + Math.sin(Math.PI * transfer) * height * 0.35;
          const localY = transfer < 1 ? screenY - sceneTop : height / 2;
          circle.setAttribute("cx", String(mix(x, width / 2, transfer)));
          circle.setAttribute("cy", String(localY));
          // Change the vector radius itself: never enlarge a rasterized dot.
          circle.setAttribute("r", String(mix(radius, cover, expansion)));
          svg.style.opacity = progress > 0 ? "1" : "0";
          geometry.period.style.opacity = progress > 0 ? "0" : "1";
          scene.dataset.arrived = String(transfer === 1);
        };
        const trigger = ScrollTrigger.create({
          trigger: passage, start: "top bottom", end: "bottom bottom",
          onUpdate: self => paint(self.progress),
          onRefresh: self => { geometry = measure(); paint(self.progress); },
        });
        paint(trigger.progress);
        return () => {
          geometry.period.style.opacity = "";
          svg.style.opacity = "0";
          delete scene.dataset.arrived;
        };
      }, ref);
    });
    return () => { disposed = true; media.revert(); };
  }, []);
  return <div ref={ref} className="dot-passage" aria-hidden="true">
    <div className="dot-scene">
      <svg className="dot-scene-svg" width="100%" height="100%" focusable="false">
        <circle className="dot-scene-circle" cx="0" cy="0" r="0" fill="#0B2D26" />
      </svg>
    </div>
  </div>;
}
