"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/siteConfig";
import { afterHydrationTask } from "@/lib/motionScheduler";
gsap.registerPlugin(ScrollTrigger);
const groups = [
  { title: "Quick Links", links: [["About Me", "#about"], ["Services", "#services"], ["Projects", "#projects"], ["Tech Stack", "#stack"], ["Contact Me", "#contact"]] },
  { title: "Explore", links: [["My Approach", "#vision"], ["My Process", "#process"], ["Testimonials", "#testimonials"], ["Work Together", `mailto:${siteConfig.email}`], ["Back to Top", "#hero"]] },
  { title: "Follow on", links: [["GitHub", "https://github.com/waseemakram-dev"]] },
];
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    const cancelTask = afterHydrationTask(() => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".diroz-footer-reveal", { opacity: 0, duration: 1, stagger: 0.12, ease: "power1.out", scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } });
      }, ref);
    });
    return () => {
      disposed = true;
      cancelTask();
      media?.revert();
    };
  }, []);
  return (
    <footer className="diroz-footer" ref={ref} aria-label="Site footer">
      <div className="diroz-footer-container"><div className="diroz-footer-grid">
        <div className="diroz-footer-brand diroz-footer-reveal">
          <div className="diroz-footer-contact">
            <a className="diroz-footer-email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <p>Full-stack developer & SaaS architect</p>
          </div>
          <a className="diroz-footer-wordmark" href="#hero" aria-label={`${siteConfig.name} — back to top`}>Waseem<span aria-hidden="true">©</span></a>
        </div>
        <div className="diroz-footer-right">
          <nav className="diroz-footer-menus" aria-label="Footer navigation">
            {groups.map(group => <div className="diroz-footer-menu diroz-footer-reveal" key={group.title}>
              <h2>{group.title}</h2><div className="diroz-footer-links">{group.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
            </div>)}
          </nav>
          <div className="diroz-footer-copyright diroz-footer-reveal">
            <p>Copyright © {new Date().getFullYear()}. All Rights Reserved by <a href="#hero">{siteConfig.name}</a></p>
            <p>Built with <span>care & purpose.</span></p>
          </div>
        </div>
      </div></div>
    </footer>
  );
}
