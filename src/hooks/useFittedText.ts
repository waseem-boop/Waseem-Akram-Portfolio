"use client";

import { useLayoutEffect, useRef } from "react";

export function useFittedText(enabled = true) {
  const wrapper = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const outer = wrapper.current;
    const inner = text.current;
    if (!outer || !inner) return;
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      const ratio = enabled
        ? outer.clientWidth / Math.max(1, inner.offsetWidth)
        : 1;
      inner.style.transform = `scale(${ratio})`;
      outer.style.height = `${inner.offsetHeight * ratio}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    fit();
    void document.fonts.ready.then(fit);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [enabled]);

  return { wrapper, text };
}
