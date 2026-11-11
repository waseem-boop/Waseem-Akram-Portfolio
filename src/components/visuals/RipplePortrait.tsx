"use client";

import { useEffect, useRef } from "react";
import { createRipplePortrait } from "@/lib/ripple/createRipplePortrait";

export default function RipplePortrait() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    const hero = element?.closest<HTMLElement>(".hero");
    if (!element || !hero) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    const mount = () => {
      dispose?.();
      dispose = undefined;
      element.dataset.ready = "false";
      if (reduced.matches) return;
      try {
        dispose = createRipplePortrait(element, hero, (ready) => {
          element.dataset.ready = String(ready);
        });
      } catch {
        element.dataset.ready = "false";
      }
    };
    mount();
    reduced.addEventListener("change", mount);
    return () => {
      reduced.removeEventListener("change", mount);
      dispose?.();
    };
  }, []);

  return <div ref={host} className="ripple-portrait" aria-hidden="true" />;
}
