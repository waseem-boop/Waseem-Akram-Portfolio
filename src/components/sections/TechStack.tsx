"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techStackData } from "@/data/techstack";

gsap.registerPlugin(ScrollTrigger);
const tools = techStackData.rows.flat();

export default function TechStack() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const root = section.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>(".stack-orbit-stage");
      if (!stage) return;
      const ring = root.querySelector(".stack-orbit-ring");
      const photo = root.querySelector(".stack-orbit-photo");
      const badges = root.querySelectorAll(".stack-orbit-badge");
      gsap.set([ring, photo, ...badges], { rotation: 0 });
      const turnRing = gsap.quickSetter(ring, "rotation", "deg");
      const turnPhoto = gsap.quickSetter(photo, "rotation", "deg");
      const turnBadges = gsap.quickSetter(badges, "rotation", "deg");
      let elapsed = 0;
      let scrollProgress = 0;
      let visible = false;
      let running = false;
      const paint = () => {
        // Automatic motion and scrolling add together. Counter-rotate the
        // labels so only their positions orbit, while the photo turns oppositely.
        const angle = -(elapsed * 4 + scrollProgress * 80);
        turnRing(angle);
        turnBadges(-angle);
        turnPhoto(elapsed * 3 + scrollProgress * 40);
      };
      const tick = (_time: number, deltaMs: number) => {
        elapsed = (elapsed + Math.min(deltaMs, 64) / 1000) % 360;
        paint();
      };
      const sync = () => {
        const active = visible && !document.hidden;
        if (active === running) return;
        running = active;
        if (active) { paint(); gsap.ticker.add(tick); }
        else gsap.ticker.remove(tick);
      };
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onUpdate: self => {
          scrollProgress = self.progress;
          if (running) paint();
        },
      });
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      observer.observe(stage);
      document.addEventListener("visibilitychange", sync);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", sync);
        gsap.ticker.remove(tick);
      };
    }, section);
    return () => media.revert();
  }, []);

  return (
    <section className="stack-orbit-section" id="stack" ref={section} aria-labelledby="tech-stack-heading">
      <header className="stack-orbit-header">
        <p className="stack-orbit-eyebrow">05 — THE TOOLKIT</p>
        <h2 id="tech-stack-heading">MY EVERYDAY<br />STACK.</h2>
        <p className="stack-orbit-intro">The tools behind the websites, apps and platforms I build.</p>
      </header>
      <div className="stack-orbit-stage">
        <div className="stack-orbit-picture" aria-hidden="true">
          <Image className="stack-orbit-photo" src="/images/stack-orbit.webp" alt="" fill sizes="(max-width: 600px) 70vw, 720px" />
        </div>
        <ul className="stack-orbit-ring" aria-label="Technologies and frameworks">
          {tools.map((tool, index) => {
            const angle = (index / tools.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <li className="stack-orbit-node" key={tool.id} style={{ left: (50 + Math.cos(angle) * 44) + "%", top: (50 + Math.sin(angle) * 44) + "%" }}>
                <div className="stack-orbit-badge" title={tool.label}>
                  <Image src={"/dock-icons/" + tool.id + ".png"} alt="" width={22} height={22} unoptimized />
                  <span>{tool.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="stack-orbit-bottom"><span>IDEA → DESIGN → DEVELOPMENT → LAUNCH</span><a href={techStackData.ctaHref}>Let’s build something <span aria-hidden="true">↗</span></a></div>
    </section>
  );
}
