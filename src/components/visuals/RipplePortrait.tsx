"use client";

import { useEffect, useRef } from "react";

type SeedEvent = {
  type: "move" | "down";
  clientX: number;
  clientY: number;
};

export default function RipplePortrait({ backgroundOnly = false }: { backgroundOnly?: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    const hero = element?.closest<HTMLElement>(backgroundOnly ? ".hero-section" : ".hero");
    if (!element || !hero) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let loading = false;
    let disposed = false;
    let latestSeed: SeedEvent | undefined;

    const mount = () => {
      if (loading || dispose || disposed || reduced.matches) return;
      loading = true;
      element.dataset.ready = "false";
      void import("@/lib/ripple/createRipplePortrait")
        .then(({ createRipplePortrait }) => {
          loading = false;
          detachInteractionListeners();
          if (disposed || reduced.matches) return;
          try {
            dispose = createRipplePortrait(
              element,
              hero,
              (ready) => {
                element.dataset.ready = String(ready);
              },
              latestSeed,
              backgroundOnly,
            );
          } catch {
            element.dataset.ready = "false";
          }
        })
        .catch(() => {
          loading = false;
          detachInteractionListeners();
          element.dataset.ready = "false";
        });
    };

    const onEnterOrMove = (event: PointerEvent) => {
      latestSeed = { type: "move", clientX: event.clientX, clientY: event.clientY };
      if (!loading && !dispose) mount();
    };
    const onDown = (event: PointerEvent) => {
      latestSeed = { type: "down", clientX: event.clientX, clientY: event.clientY };
      if (!loading && !dispose) mount();
    };
    const onReducedChange = () => {
      if (reduced.matches) {
        dispose?.();
        dispose = undefined;
        element.dataset.ready = "false";
      } else {
        attachInteractionListeners();
      }
    };

    const attachInteractionListeners = () => {
      hero.addEventListener("pointerenter", onEnterOrMove, { passive: true });
      hero.addEventListener("pointermove", onEnterOrMove, { passive: true });
      hero.addEventListener("pointerdown", onDown, { passive: true });
    };
    const detachInteractionListeners = () => {
      hero.removeEventListener("pointerenter", onEnterOrMove);
      hero.removeEventListener("pointermove", onEnterOrMove);
      hero.removeEventListener("pointerdown", onDown);
    };

    attachInteractionListeners();
    reduced.addEventListener("change", onReducedChange);

    return () => {
      disposed = true;
      detachInteractionListeners();
      reduced.removeEventListener("change", onReducedChange);
      dispose?.();
    };
  }, [backgroundOnly]);

  return <div ref={host} className={backgroundOnly ? "projects-background-ripple" : "ripple-portrait"} aria-hidden="true" />;
}
