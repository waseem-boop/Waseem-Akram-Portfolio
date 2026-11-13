"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import { afterHydrationTask } from "@/lib/motionScheduler";
gsap.registerPlugin(ScrollTrigger);
const groups = [
  { title: "Quick Links", links: [["About Me", "/#about"], ["Services", "/#services"], ["All Projects", "/projects"], ["Tech Stack", "/#stack"], ["Contact Me", "/#contact"]] },
  { title: "Explore", links: [["My Approach", "/#vision"], ["My Process", "/#process"], ["Work Together", `mailto:${siteConfig.email}`], ["Back to Top", "/#hero"]] },
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
          <Link className="diroz-footer-wordmark" href="/" aria-label={`${siteConfig.name} — home`}>Waseem<span aria-hidden="true">©</span></Link>
        </div>
        <div className="diroz-footer-right">
          <nav className="diroz-footer-menus" aria-label="Footer navigation">
            {groups.map(group => <div className="diroz-footer-menu diroz-footer-reveal" key={group.title}>
              <h2>{group.title}</h2><div className="diroz-footer-links">{group.links.map(([label, href]) => href.startsWith("/") ? <Link key={label} href={href}>{label}</Link> : <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{label}</a>)}</div>
            </div>)}
          </nav>
          <div className="diroz-footer-copyright diroz-footer-reveal">
            <p>Copyright © {new Date().getFullYear()}. All Rights Reserved by <Link href="/">{siteConfig.name}</Link></p>
            <p>Built with <span>care & purpose.</span></p>
          </div>
        </div>
      </div></div>
    </footer>
  );
}
