"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  clamp,
  closestRow,
  easeOut,
  lerpFactor,
  rowTypography,
  serviceMotion as motion,
  type ServiceRowBounds,
} from "@/lib/serviceMotion";

gsap.registerPlugin(ScrollTrigger);

export function useServiceAnimation(
  sectionRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLDivElement | null>,
  ready: boolean,
  paused: boolean,
  setActive: (index: number) => void,
) {
  const pausedRef = useRef(paused);
  const control = useRef({ hover: -1, focus: -1, slide: 0 });
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const section = sectionRef.current;
    const floating = floatingRef.current;
    if (!ready || !section || !floating) return;
    const rows = Array.from(
      section.querySelectorAll<HTMLAnchorElement>(".service-row"),
    );
    const names = rows.map((row) =>
      row.querySelector<HTMLElement>(".service-name")!,
    );
    const column = section.querySelector<HTMLElement>(".services-column")!;
    const dock = section.querySelector<HTMLElement>(".services-dock")!;
    const preview = section.querySelector<HTMLElement>(".services-frame")!;
    const layers = Array.from(
      floating.querySelectorAll<HTMLElement>(".service-floating-layer"),
    );
    const cursor = document.getElementById("service-pointer");
    const stageLayers = Array.from(
      section.querySelectorAll<HTMLElement>(".service-stage-layer"),
    );
    const progressBar = section.querySelector<HTMLElement>(
      ".services-progress-bar",
    )!;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const mobile = matchMedia(`(max-width: ${motion.breakpoint}px)`);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let frame = 0;
    let visible = false;
    let bounds: ServiceRowBounds[] = [];
    let sectionTop = 0;
    let sectionHeight = 0;
    let columnTop = 0;
    let columnHeight = 0;
    let dockHeight = 0;
    let dockOffset = 0;
    let frameLeft = 0;
    let frameWidth = 320;
    let frameHeight = 400;
    let mobileBottom = 0;
    let active = -1;
    let focusTime = 0;
    let lastTime = 0;
    let trail = false;
    let lift = 0;
    let liftFrom = 0;
    let liftTime = 0;
    let liftDuration: number = motion.dockDuration;
    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const follow = { ...pointer };
    const rowProgress = rows.map(() => 0);
    const screenTimers = new Map<
      HTMLElement,
      { time: number; index: number; z: number }
    >();
    const animations = new Set<Animation>();

    const measure = () => {
      if (disposed) return;
      const scroll = window.scrollY;
      const col = column.getBoundingClientRect();
      const frameRect = preview.getBoundingClientRect();
      const dockRect = dock.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      sectionTop = sectionRect.top + scroll;
      sectionHeight = section.offsetHeight;
      columnTop = col.top + scroll;
      columnHeight = col.height;
      dockHeight = dockRect.height;
      dockOffset = frameRect.top - dockRect.top;
      frameLeft = frameRect.left;
      frameWidth = frameRect.width;
      frameHeight = frameRect.height;
      mobileBottom =
        (parseFloat(getComputedStyle(column).top) || 64) + column.offsetHeight;
      bounds = rows.map((row, index) => {
        const rect = row.getBoundingClientRect();
        const name = names[index].getBoundingClientRect();
        return {
          top: rect.top + scroll,
          center: rect.top + scroll + rect.height / 2,
          nameTop: name.top + scroll,
          nameBottom: name.bottom + scroll,
        };
      });
    };

    const play = (
      element: HTMLElement,
      keyframes: Keyframe[],
      duration: number,
      easing: string,
    ) => {
      const animation = element.animate(keyframes, { duration, easing });
      animations.add(animation);
      void animation.finished
        .catch(() => {})
        .finally(() => animations.delete(animation));
    };

    const drawSlides = () => {
      stageLayers.forEach((layer, index) => {
        const strip = layer.querySelector<HTMLElement>(".service-slide-strip")!;
        strip.style.transform =
          index === active
            ? `translateX(${(-control.current.slide * 100) / 3}%)`
            : "none";
      });
      section
        .querySelectorAll<HTMLElement>(".service-slide-dot")
        .forEach((dot, index) => {
          dot.dataset.current = String(index === control.current.slide);
          dot.setAttribute(
            "aria-pressed",
            String(index === control.current.slide),
          );
        });
    };

    const paint = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const frames = lastTime ? Math.min((now - lastTime) / (1000 / 60), 3) : 1;
      lastTime = now;
      const scroll = window.scrollY;
      const isMobile = mobile.matches;
      const off = reduced.matches;
      if (cursor) {
        cursor.style.opacity =
          !isMobile && fine.matches && !off && control.current.hover >= 0
            ? "1"
            : "0";
        cursor.style.transform = `translate3d(${pointer.x - 40}px,${pointer.y - 40}px,0)`;
      }
      const focus =
        control.current.focus >= 0
          ? control.current.focus
          : !isMobile && fine.matches && control.current.hover >= 0
            ? control.current.hover
            : closestRow(
                bounds,
                scroll,
                innerHeight,
                isMobile ? mobileBottom : undefined,
              );

      if (active !== focus) {
        active = focus;
        focusTime = now;
        control.current.slide = 0;
        setActive(focus);
        layers.forEach((layer, index) => {
          layer.dataset.current = String(index === focus);
          const cover = layer.querySelector<HTMLElement>(
            ".service-preview-cover",
          )!;
          if (index === focus && !off)
            play(
              cover,
              [{ transform: "scale(1.08)" }, { transform: "scale(1)" }],
              1200,
              "cubic-bezier(.16,1,.3,1)",
            );
        });
        stageLayers.forEach((layer, index) => {
          layer.dataset.current = String(index === focus);
        });
        rows.forEach((row, index) => {
          row.dataset.current = String(index === focus);
        });
        section
          .querySelectorAll<HTMLElement>(".service-demo")
          .forEach((demo) => {
            demo.dataset.playing = "false";
          });
        floating
          .querySelectorAll<HTMLElement>(".service-demo")
          .forEach((demo) => {
            demo.dataset.playing = "false";
          });
        // Reset the screen stack when revisiting a service so old z-indices
        // cannot keep the next crossfade hidden behind a previous screen.
        [layers[focus], stageLayers[focus]].forEach((layer) => {
          layer
            ?.querySelectorAll<HTMLElement>(".service-screen-slot")
            .forEach((slot, slotIndex) => {
              const screens = Array.from(
                slot.querySelectorAll<HTMLElement>(".service-screen"),
              );
              screens.forEach((screen, index) => {
                screen.style.zIndex =
                  index === slotIndex % screens.length ? "2" : "1";
              });
            });
        });
        screenTimers.clear();
        drawSlides();
      }

      rowProgress.forEach((value, index) => {
        const target = Number(index === focus);
        const next = off
          ? target
          : value + (target - value) * lerpFactor(0.12, frames);
        rowProgress[index] = Math.abs(target - next) < 0.003 ? target : next;
        const typography = rowTypography(rowProgress[index]);
        names[index].style.fontVariationSettings =
          `'wdth' ${typography.width.toFixed(1)}, 'wght' ${typography.weight.toFixed(0)}`;
        names[index].style.opacity = typography.opacity.toFixed(3);
      });
      const first = bounds[0]?.center ?? 0;
      const last = bounds[bounds.length - 1]?.center ?? 1;
      const progress = clamp(
        (scroll + innerHeight / 2 - first) / (last - first || 1),
      );
      progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
      drawSlides();

      const playing =
        now - focusTime > motion.dwell && !pausedRef.current && !off;
      const activeLayer = (isMobile ? stageLayers : layers)[focus];
      const demo = activeLayer?.querySelector<HTMLElement>(".service-demo");
      if (demo) {
        demo.dataset.playing = String(!off && now - focusTime > motion.dwell);
        if (playing)
          demo
            .querySelectorAll<HTMLElement>(".service-screen-slot")
            .forEach((slot, slotIndex) => {
              const screens = Array.from(
                slot.querySelectorAll<HTMLElement>(".service-screen"),
              );
              if (screens.length < 2) return;
              let timer = screenTimers.get(slot);
              if (!timer) {
                timer = {
                  time: now + motion.screenInterval + 450 * slotIndex,
                  index: slotIndex % screens.length,
                  z: 3,
                };
                screenTimers.set(slot, timer);
              }
              if (now < timer.time) return;
              timer.time = now + motion.screenInterval;
              timer.index = (timer.index + 1) % screens.length;
              const screen = screens[timer.index];
              screen.style.zIndex = String(++timer.z);
              play(
                screen,
                [{ opacity: 0 }, { opacity: 1 }],
                motion.screenFade,
                "ease-out",
              );
            });
      }

      floating.style.opacity =
        !isMobile &&
        !off &&
        scroll + innerHeight > sectionTop &&
        scroll < sectionTop + sectionHeight
          ? "1"
          : "0";
      if (!isMobile && !off) {
        const shouldTrail =
          fine.matches &&
          control.current.hover >= 0 &&
          control.current.focus < 0;
        if (shouldTrail !== trail) {
          trail = shouldTrail;
          liftFrom = lift;
          liftTime = now;
          liftDuration = trail ? motion.liftDuration : motion.dockDuration;
          if (trail) {
            follow.x = pointer.x;
            follow.y = pointer.y;
          }
        }
        lift =
          liftFrom +
          (Number(trail) - liftFrom) * easeOut((now - liftTime) / liftDuration);
        const previousX = follow.x;
        follow.x += (pointer.x - follow.x) * lerpFactor(0.1, frames);
        follow.y += (pointer.y - follow.y) * lerpFactor(0.1, frames);
        const tilt = clamp(((follow.x - previousX) / frames) * 0.6, -12, 12);
        const stickyTop = innerHeight / 2 - frameHeight / 2;
        const top =
          Math.min(
            Math.max(columnTop - scroll, stickyTop),
            columnTop + columnHeight - dockHeight - scroll,
          ) + dockOffset;
        const dockX = frameLeft + frameWidth / 2;
        const dockY = top + frameHeight / 2;
        const cursorX = clamp(
          follow.x + motion.cursorOffset,
          motion.width / 2 + 8,
          innerWidth - motion.width / 2 - 8,
        );
        const cursorY = clamp(
          follow.y,
          motion.height / 2 + 8,
          innerHeight - motion.height / 2 - 8,
        );
        const x = dockX + (cursorX - dockX) * lift;
        const y = dockY + (cursorY - dockY) * lift;
        const scale =
          frameWidth / motion.width + (1 - frameWidth / motion.width) * lift;
        floating.style.transform = `translate3d(${(x - motion.width / 2).toFixed(1)}px,${(y - motion.height / 2).toFixed(1)}px,0) rotate(${(tilt * lift).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }
      frame = requestAnimationFrame(paint);
    };

    const pointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const focusRow = (event: FocusEvent) => {
      const index = rows.indexOf(event.target as HTMLAnchorElement);
      if (index < 0 || !(event.target as HTMLElement).matches(":focus-visible"))
        return;
      control.current.focus = index;
      const row = bounds[index];
      window.scrollTo({
        top: Math.max(
          0,
          mobile.matches
            ? row.top - mobileBottom
            : row.center - innerHeight / 2,
        ),
        behavior: reduced.matches ? "instant" : "smooth",
      });
    };
    const blurRow = () => {
      control.current.focus = -1;
    };
    const leave = () => {
      control.current.hover = -1;
    };
    const list = section.querySelector<HTMLElement>(".services-list")!;
    const hoverListeners = rows.map((row, index) => {
      const enter = () => {
        if (fine.matches) control.current.hover = index;
      };
      row.addEventListener("pointerenter", enter);
      return () => row.removeEventListener("pointerenter", enter);
    });
    list.addEventListener("pointerleave", leave);
    list.addEventListener("pointermove", blurRow);
    section.addEventListener("focusin", focusRow);
    section.addEventListener("focusout", blurRow);
    window.addEventListener("pointermove", pointerMove, { passive: true });
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame && !document.hidden) {
          measure();
          frame = requestAnimationFrame(paint);
        }
        if (!visible) {
          cancelAnimationFrame(frame);
          frame = 0;
          lastTime = 0;
          floating.style.opacity = "0";
          if (cursor) cursor.style.opacity = "0";
        }
      },
      { rootMargin: "200px" },
    );
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (visible && !frame) {
        lastTime = 0;
        frame = requestAnimationFrame(paint);
      }
    };
    const refresh = () => {
      measure();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(section);
    window.addEventListener("resize", refresh);
    mobile.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", visibility);
    ScrollTrigger.addEventListener("refresh", refresh);
    section.dataset.motion = "on";
    measure();
    observer.observe(section);
    const context = gsap.context(() => {
      if (reduced.matches) return;
      gsap.fromTo(
        section.querySelectorAll(".services-head, .service-row"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        },
      );
    }, section);
    void document.fonts.ready.then(measure);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      if (cursor) cursor.style.opacity = "0";
      observer.disconnect();
      resize.disconnect();
      context.revert();
      hoverListeners.forEach((cleanup) => cleanup());
      list.removeEventListener("pointerleave", leave);
      list.removeEventListener("pointermove", blurRow);
      section.removeEventListener("focusin", focusRow);
      section.removeEventListener("focusout", blurRow);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("resize", refresh);
      mobile.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", visibility);
      ScrollTrigger.removeEventListener("refresh", refresh);
      delete section.dataset.motion;
    };
  }, [sectionRef, floatingRef, ready, setActive]);

  return control;
}
