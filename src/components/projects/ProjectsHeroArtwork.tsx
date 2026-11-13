"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const width = 1536;
const height = 1024;
const artworkSrc = "/images/projects-showcase/developer-hero-full.webp";
const patch = { x: 594, y: 333, width: 281, height: 133 };
// Coordinates are measured in the original illustration, before responsive scaling.
const hands = [
  { x: 637, y: 418, radiusX: 30, radiusY: 25 },
  { x: 756, y: 376, radiusX: 28, radiusY: 24 },
];

export default function ProjectsHeroArtwork() {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = patch.width;
    sourceCanvas.height = patch.height;
    const sourceContext = sourceCanvas.getContext("2d");
    if (!sourceContext) return;

    const frame = context.createImageData(patch.width, patch.height);
    let source: Uint8ClampedArray | undefined;
    let raf = 0;
    let restTimer = 0;

    const reset = () => {
      canvas.hidden = true;
      image.style.visibility = "";
    };
    const capture = () => {
      if (!image.complete || !image.naturalWidth) return;
      sourceContext.globalCompositeOperation = "copy";
      sourceContext.drawImage(image, -patch.x, -patch.y, width, height);
      source = sourceContext.getImageData(0, 0, patch.width, patch.height).data;
      reset();
    };

    const render = () => {
      raf = 0;
      if (motion.matches || !source) return;
      const { top, bottom } = image.getBoundingClientRect();
      if (bottom <= 0 || top >= window.innerHeight) {
        reset();
        return;
      }

      const phase = Math.sin((window.scrollY / 86) * Math.PI * 2);
      const hand = hands[phase >= 0 ? 0 : 1];
      const press = Math.abs(phase) ** 2;
      frame.data.set(source);

      // Warp only the fingers and their immediate surroundings, with a fixed wrist
      // and a soft edge so the patch stays registered with the static illustration.
      for (let y = 0; y < patch.height; y++) {
        for (let x = 0; x < patch.width; x++) {
          const dx = (x + patch.x - hand.x) / hand.radiusX;
          const dy = (y + patch.y - hand.y) / hand.radiusY;
          const falloff = Math.max(0, 1 - dx * dx - dy * dy);
          if (falloff === 0) continue;

          const sampledY = Math.max(0, y - 7 * press * falloff ** 2);
          const row = Math.floor(sampledY);
          const blend = sampledY - row;
          const target = (y * patch.width + x) * 4;
          const pixel = (row * patch.width + x) * 4;
          for (let channel = 0; channel < 4; channel++) {
            frame.data[target + channel] =
              source[pixel + channel] * (1 - blend) +
              source[pixel + patch.width * 4 + channel] * blend;
          }
        }
      }
      if (canvas.hidden) {
        context.globalCompositeOperation = "copy";
        context.drawImage(image, 0, 0, width, height);
      }
      context.putImageData(frame, patch.x, patch.y);
      canvas.hidden = false;
      image.style.visibility = "hidden";
    };

    const onScroll = () => {
      if (motion.matches || !source) return;
      const { top, bottom } = image.getBoundingClientRect();
      if (bottom <= 0 || top >= window.innerHeight) {
        reset();
        return;
      }
      if (!raf) raf = window.requestAnimationFrame(render);
      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(reset, 120);
    };

    capture();
    image.addEventListener("load", capture);
    motion.addEventListener("change", reset);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      image.removeEventListener("load", capture);
      motion.removeEventListener("change", reset);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(restTimer);
      reset();
    };
  }, []);

  return (
    <div className="hero-artwork" aria-hidden="true">
      <Image
        ref={imageRef}
        src={artworkSrc}
        alt=""
        width={width}
        height={height}
        sizes="(max-width: 809px) calc(100vw - 32px), (max-width: 1600px) 65vw, 1040px"
        preload
      />
      <canvas ref={canvasRef} width={width} height={height} hidden />
    </div>
  );
}
