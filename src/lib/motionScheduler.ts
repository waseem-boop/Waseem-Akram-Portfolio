"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let configured = false;
let lastRefreshScrollHeight = 0;
let lastRefreshWidth = 0;
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
let refreshFrame = 0;
let refreshPending = false;

const taskQueue: Array<{ fn: () => void; cancelled: boolean }> = [];
let draining = false;

function ensureConfigured() {
  if (configured || typeof window === "undefined") return;
  configured = true;
  // Avoid redundant unconditional ScrollTrigger.refresh() on window "load"
  // when image dimensions are already reserved in layout CSS.
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,resize",
  });
  window.addEventListener(
    "load",
    () => {
      const height = document.documentElement.scrollHeight;
      const width = window.innerWidth;
      if (height !== lastRefreshScrollHeight || width !== lastRefreshWidth) {
        scheduleScrollRefresh();
      }
    },
    { once: true, passive: true },
  );
}

function runScheduledRefresh() {
  if (draining || taskQueue.length > 0) {
    refreshPending = true;
    return;
  }
  refreshPending = false;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    if (draining || taskQueue.length > 0) {
      refreshPending = true;
      return;
    }
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      lastRefreshScrollHeight = document.documentElement.scrollHeight;
      lastRefreshWidth = window.innerWidth;
      ScrollTrigger.refresh();
    });
  }, 48);
}

export function scheduleScrollRefresh() {
  if (typeof window === "undefined") return;
  ensureConfigured();
  refreshPending = true;
  runScheduledRefresh();
}

function drainQueue() {
  if (draining) return;
  const next = taskQueue.shift();
  if (!next) {
    if (refreshPending) runScheduledRefresh();
    return;
  }
  draining = true;
  setTimeout(() => {
    draining = false;
    if (!next.cancelled) next.fn();
    if (taskQueue.length > 0) drainQueue();
    else if (refreshPending) runScheduledRefresh();
  }, 0);
}

/**
 * Schedules setup work in its own macrotask after initial hydration/paint
 * so multiple below-the-fold sections never block a single >50ms Long Task.
 */
export function afterHydrationTask(fn: () => void): () => void {
  ensureConfigured();
  const entry = { fn, cancelled: false };
  taskQueue.push(entry);
  drainQueue();
  return () => {
    entry.cancelled = true;
  };
}

/**
 * Waits for document.fonts.ready, then yields into a fresh macrotask before
 * running layout/SplitText/canvas measurement callbacks.
 */
export function whenFontsReady(fn: () => void): () => void {
  let cancelled = false;
  let cancelTask: (() => void) | undefined;
  void document.fonts.ready.then(() => {
    if (cancelled) return;
    cancelTask = afterHydrationTask(() => {
      if (!cancelled) fn();
    });
  });
  return () => {
    cancelled = true;
    cancelTask?.();
  };
}
