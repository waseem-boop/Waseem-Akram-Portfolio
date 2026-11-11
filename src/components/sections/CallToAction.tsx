"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/sections/Hero";
import PortfolioButton from "@/components/ui/PortfolioButton";
import { siteConfig } from "@/data/siteConfig";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    let disposed = false;
    const media = gsap.matchMedia();
    media.add({ mobile: "(max-width: 991px)", desktop: "(min-width: 992px)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      if (context.conditions?.reduced) return;
      const mobile = context.conditions?.mobile;
      const frame = section.querySelector(".contact-cta-corners");
      const card = section.querySelector(".contact-cta-card");
      const reveal = section.querySelector(".contact-hero-reveal");
      const content = section.querySelector(".contact-cta-container");
      const passage = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => section.getBoundingClientRect().top + window.scrollY + section.offsetHeight - window.innerHeight * 2.5,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      passage.fromTo(reveal,
        { y: 0, yPercent: 100 },
        { y: 0, yPercent: 0, ease: "none", duration: 1 }, 0);
      passage.to(section.querySelector(".contact-contrast"), { opacity: 0, ease: "none", duration: 1 }, 0);
      passage.to(content, { y: () => -window.innerHeight, ease: "none", duration: 1 }, 0);
      if (mobile) return;
      const leftCorners = section.querySelectorAll(".contact-cta-corner:nth-child(1)");
      const rightCorners = section.querySelectorAll(".contact-cta-corner:nth-child(2)");
      gsap.set(frame, { rotation: 90, scale: 0.8, width: 340, height: 161, top: 177, xPercent: -50 });
      gsap.set(card, { scale: 0, opacity: 0 });
      gsap.set(leftCorners, { left: 0, x: 0 });
      gsap.set(rightCorners, { left: "100%", xPercent: -100 });
      let stage = 0;
      let transition: gsap.core.Timeline | undefined;
      // Fundory uses five discrete variants with a spring, not one scrubbed zoom.
      // Its trigger blocks are 50vh high, separated by 140px on desktop.
      const applyStage = (next: number) => {
        if (next === stage) return;
        stage = next;
        section.dataset.ctaStage = String(stage);
        transition?.kill();
        // Original Framer spring: mass .6, stiffness 60, damping 18.
        const spring = (p: number) => {
          const a = -3.8196601125, b = -26.1803398875;
          const response = (t: number) => 1 - (b * Math.exp(a * t) - a * Math.exp(b * t)) / (b - a);
          return response(p * 1.8) / response(1.8);
        };
        transition = gsap.timeline({ defaults: { duration: 1.8, ease: spring, overwrite: "auto" } });
        transition.to(frame, {
          rotation: stage === 0 ? 90 : 0, scale: stage === 0 ? 0.8 : 1,
          width: stage >= 3 ? "100%" : 340,
          height: stage >= 3 ? 504 : 161, top: stage >= 3 ? 0 : 177,
        }, 0);
        transition.to(leftCorners, { left: stage >= 2 ? "100%" : 0, xPercent: stage >= 2 ? -100 : 0 }, 0);
        transition.to(rightCorners, { left: stage >= 2 ? 0 : "100%", xPercent: stage >= 2 ? 0 : -100 }, 0);
        transition.to(card, { scale: stage >= 4 ? 1 : 0, opacity: stage >= 4 ? 1 : 0 }, 0);
      };
      section.dataset.ctaStage = "0";
      ScrollTrigger.create({
        trigger: section, start: "top top", end: "bottom bottom", invalidateOnRefresh: true,
        onUpdate: self => {
          const travel = self.scroll() - self.start;
          const first = 140 + window.innerHeight * 0.73;
          const interval = window.innerHeight * 0.5 + 140;
          applyStage(travel < first ? 0 : Math.min(4, 1 + Math.floor((travel - first) / interval)));
        },
      });
      return () => { transition?.kill(); delete section.dataset.ctaStage; };
    }, section);
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => { disposed = true; media.revert(); };
  }, []);

  const href = `mailto:${siteConfig.email}`;
  const avatars = [
    "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393016/waseem-akram/cta/avatar-1.png",
    "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393016/waseem-akram/cta/avatar-2.png",
    "https://res.cloudinary.com/eckkgw2a/image/upload/v1794393016/waseem-akram/cta/avatar-3.png",
  ];
  return (
    <section className="contact-cta" id="contact" ref={ref} aria-labelledby="contact-cta-heading">
      <div className="contact-cta-screen" style={{ backgroundImage: `url("${siteConfig.heroBackground}")` }}>
        <div className="contact-contrast" aria-hidden="true" />
        <div className="contact-cta-container">
          <div className="contact-cta-corners" aria-hidden="true">
            {[0, 1].map(row => <div className={`contact-cta-corner-pair contact-cta-pair-${row}`} key={row}>
              {[0, 1].map(column => <div className={`contact-cta-corner contact-cta-art-${row * 2 + column}`} key={column}>
                <img src="https://res.cloudinary.com/eckkgw2a/image/upload/v1794393016/waseem-akram/cta/brand-corner.svg" width="86" height="86" alt="" />
              </div>)}
            </div>)}
          </div>
          <div className="contact-cta-card">
            <div className="contact-cta-badge">
              <div className="contact-cta-avatars" aria-hidden="true">
                {avatars.map((avatarSrc, index) => <img key={index} src={avatarSrc} alt="" width="28" height="28" />)}
                <span>WA</span>
              </div>
              <span>Let’s work together</span>
            </div>
            <h2 id="contact-cta-heading">Have an <em>idea?</em> Let’s build something <em>remarkable.</em></h2>
            <p>From websites to SaaS platforms, I turn your ideas into thoughtful digital products. Let’s bring yours to life.</p>
            <div className="contact-cta-actions">
              <PortfolioButton href={href} label="Let’s talk" />
              <PortfolioButton href="#projects" label="View my work" variant="secondary" />
            </div>
          </div>
        </div>
        <div className="contact-hero-reveal" aria-hidden="true" inert>
          <Hero repeat />
        </div>
      </div>
      <div className="contact-loop-boundary" data-loop-return aria-hidden="true" />
      <a className="contact-restart" href="#hero">Back to the beginning ↑</a>
    </section>
  );
}

