"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PortfolioButton from "@/components/ui/PortfolioButton";
import ProjectsHeroArtwork from "@/components/projects/ProjectsHeroArtwork";
import RipplePortrait from "@/components/visuals/RipplePortrait";
import { projectsData } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";

export interface ShowcaseProject {
  slug: string;
  title: string;
  role: string;
  categoryLabel: string;
  year: string;
  category: "full-stack-erp" | "saas-platforms" | "brand-web";
  column: "left" | "right";
  image: string;
  summary: string;
  stack: string[];
  metric: string;
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    slug: "azad-concrete-erp",
    title: "AZAD CONCRETE ERP",
    role: "LEAD FULL-STACK & DATABASE ARCHITECT",
    categoryLabel: "FULL-STACK ERP & ACCOUNTING",
    year: "2026",
    category: "full-stack-erp",
    column: "left",
    image: "/images/projects-showcase/azad-concrete-erp/01-azad-concrete-erp-dashboard.webp",
    summary: "A BESPOKE CLOUD-BACKED MANUFACTURING ERP UNIFYING RAW MATERIAL INTAKE, CONCRETE PRODUCTION COSTING, FINISHED STOCK TRACKING, PDF GATEPASS INVOICING, AND DOUBLE-ENTRY ACCOUNTING.",
    stack: ["NEXT.JS 16", "POSTGRESQL", "RBAC AUTH", "PDF-LIB"],
    metric: "10+ INTEGRATED MODULES"
  },
  {
    slug: "monivo",
    title: "MONIVO",
    role: "UI SYSTEMS & FULL-STACK DEVELOPER",
    categoryLabel: "COLLABORATIVE WORK SAAS",
    year: "2026",
    category: "saas-platforms",
    column: "right",
    image: "/images/projects-showcase/monivo/01-monivo-home.webp",
    summary: "DARK-MODE COLLABORATIVE SAAS WORKSPACE PAIRING LOW-GLARE ARCHITECTURAL SURFACES, BESPOKE EDITORIAL TYPOGRAPHY, AND ZERO-CLS MOTION SEQUENCING.",
    stack: ["NEXT.JS 16", "TYPESCRIPT", "GSAP", "DESIGN SYSTEMS"],
    metric: "ZERO LAYOUT SHIFT"
  },
  {
    slug: "veyra-studio",
    title: "VEYRA STUDIO",
    role: "CREATIVE TECHNOLOGIST & ARCHITECT",
    categoryLabel: "DIGITAL AGENCY SHOWCASE",
    year: "2026",
    category: "brand-web",
    column: "left",
    image: "/images/projects-showcase/veyra-studio/01-veyra-studio-hero.png",
    summary: "KINETIC TYPOGRAPHY AND MULTI-ROUTE DIGITAL AGENCY SHOWCASE WITH FLUID CLAMP SCALING, INLINE 3D VISUAL PILLS, AND GSAP SCROLL CHOREOGRAPHY.",
    stack: ["NEXT.JS 16", "REACT 19", "GSAP TIMELINES", "LENIS"],
    metric: "7 CORE ROUTES"
  },
  {
    slug: "avenor",
    title: "AVENOR",
    role: "LEAD FRONTEND ENGINEER",
    categoryLabel: "ARCHITECTURE & SPATIAL WEB",
    year: "2026",
    category: "brand-web",
    column: "right",
    image: "/images/projects-showcase/avenor/01-avenor-home.png",
    summary: "ATMOSPHERIC ARCHITECTURE AND INTERIORS PORTFOLIO COMBINING FULL-BLEED SPATIAL STUDIES, TACTILE PILL CTAS, AND UNHURRIED PHOTOGRAPHY PACING.",
    stack: ["NEXT.JS 16", "REACT 19", "GSAP", "WEBP OPTIMIZED"],
    metric: "24+ SPATIAL STUDIES"
  }
];

const maxSnapshotCount = Math.max(0, ...projectsData.map((project) => project.snapshots.length));
const marqueeItems = Array.from({ length: maxSnapshotCount }, (_, index) =>
  projectsData.flatMap((project) => project.snapshots.slice(index, index + 1)),
).flat();

type CategoryFilter = "all" | "full-stack-erp" | "saas-platforms" | "brand-web";

function SplitChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((char, index) => (
        <span
          key={index}
          className="split-char"
          style={{ transitionDelay: `${index * 24}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

export default function ProjectsShowcase() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [activeModal, setActiveModal] = useState<ShowcaseProject | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const heroTitlesRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const mainSurfaceRef = useRef<HTMLElement>(null);

  // Parallax on scroll
  useEffect(() => {
    let ticking = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (ticking || reducedMotion) return;
      ticking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight || 900;

        // Hero parallax
        if (heroRef.current && heroTitlesRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          const progress = Math.min(Math.max(-rect.top / vh, 0), 1);
          heroTitlesRef.current.style.transform = `translate3d(0, ${(progress * 58).toFixed(2)}px, 0) scale(${(1 - progress * 0.035).toFixed(3)})`;
          heroTitlesRef.current.style.opacity = String((1 - progress * 0.48).toFixed(3));
          if (heroImageRef.current) {
            heroImageRef.current.style.transform = `translate3d(0, ${(progress * 38).toFixed(2)}px, 0) scale(${(1 + progress * 0.07).toFixed(3)})`;
          }
          if (heroOverlayRef.current) {
            heroOverlayRef.current.style.opacity = String((0.15 + progress * 0.35).toFixed(3));
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for entrance reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.classList.add("is-revealed");
            entry.target.classList.add("is-entered");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.1 }
    );

    const elements = document.querySelectorAll(
      ".genstudio-projects-scope .split-reveal, .genstudio-projects-scope .reveal-slide, .genstudio-projects-scope .project-card"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filter]);

  // Escape key to close modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModal]);

  // Card 3D tilt handlers
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(y * -3).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
    card.style.setProperty("--pointer-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    card.style.setProperty("--pointer-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  }, []);

  const scrollToArchive = () => {
    if (mainSurfaceRef.current) {
      mainSurfaceRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProjects =
    filter === "all"
      ? SHOWCASE_PROJECTS
      : SHOWCASE_PROJECTS.filter((p) => p.category === filter);

  const leftColProjects =
    filter === "all"
      ? filteredProjects.filter((p) => p.column === "left")
      : filteredProjects.filter((_, idx) => idx % 2 === 0);

  const rightColProjects =
    filter === "all"
      ? filteredProjects.filter((p) => p.column === "right")
      : filteredProjects.filter((_, idx) => idx % 2 !== 0);

  return (
    <div className="genstudio-projects-scope">
      {/* 1. Hero Sticky Section */}
      <header className="hero-section" id="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-background-layer" ref={heroImageRef} aria-hidden="true">
            <img src={siteConfig.heroBackground} alt="" className="hero-image" />
            <RipplePortrait backgroundOnly />
          </div>
        </div>
        <div className="hero-overlay" ref={heroOverlayRef} />

        <div className="hero-desktop">
          <ProjectsHeroArtwork />

          <div className="hero-titles" id="heroTitles" ref={heroTitlesRef}>
            <span className="hero-eyebrow">SELECTED WORK</span>
            <h1 className="hero-h1">CREATIVE PORTFOLIO</h1>
          </div>

          <div className="hero-bottom-bar">
            <span className="side-label hide-mobile">04 CASE STUDIES</span>
            <p className="hero-subtitle">
              BUILDING MODERN WEB APPLICATIONS, SCALABLE SAAS PLATFORMS, AND HIGH-PERFORMANCE DIGITAL EXPERIENCES.
            </p>
            <span className="side-label side-label--right hide-mobile">2026 ARCHIVE</span>
          </div>

          <button
            type="button"
            className="hero-scroll-pill"
            onClick={scrollToArchive}
            aria-label="Scroll down to projects showcase"
          >
            <span>EXPLORE ARCHIVE</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </header>

      {/* 2. Main Surface: Editorial Header, Filter Bar & 2-Column Grid */}
      <section className="main-surface" ref={mainSurfaceRef}>
        <div className="section-header" aria-labelledby="portfolioHeading">
          <div className="display-banner">
            <span className="red-tag red-tag--top-left hide-mobile reveal-slide" data-dir="left">
              FEATURED
            </span>
            <h2 id="portfolioHeading" className="section-h2 split-reveal">
              <SplitChars text="PORTFOLIO" />
            </h2>
            <span className="red-tag red-tag--bottom-right hide-mobile reveal-slide" data-dir="right">
              ARCHIVE
            </span>
          </div>

          <div className="sub-row">
            <span className="side-label hide-mobile">04 PROJECTS</span>
            <p className="section-desc">
              FULL-STACK ERP SYSTEMS, B2B SAAS PLATFORMS, AND ARCHITECTURAL WEB FLAGSHIPS.
            </p>
            <span className="side-label side-label--right hide-mobile">CASE STUDIES</span>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="filter-bar" role="tablist" aria-label="Filter projects by category">
          <button
            type="button"
            role="tab"
            className={`filter-pill ${filter === "all" ? "is-active" : ""}`}
            onClick={() => setFilter("all")}
            aria-selected={filter === "all"}
          >
            ALL
          </button>
          <button
            type="button"
            role="tab"
            className={`filter-pill ${filter === "full-stack-erp" ? "is-active" : ""}`}
            onClick={() => setFilter("full-stack-erp")}
            aria-selected={filter === "full-stack-erp"}
          >
            FULL-STACK ERP
          </button>
          <button
            type="button"
            role="tab"
            className={`filter-pill ${filter === "saas-platforms" ? "is-active" : ""}`}
            onClick={() => setFilter("saas-platforms")}
            aria-selected={filter === "saas-platforms"}
          >
            SAAS PLATFORMS
          </button>
          <button
            type="button"
            role="tab"
            className={`filter-pill ${filter === "brand-web" ? "is-active" : ""}`}
            onClick={() => setFilter("brand-web")}
            aria-selected={filter === "brand-web"}
          >
            BRAND &amp; WEB
          </button>
        </div>

        {/* Staggered 2-Column Projects Grid */}
        <div className="projects-grid" id="projectsGrid">
          <div className="projects-col projects-col--left">
            {leftColProjects.map((project, idx) => (
              <div
                key={project.slug}
                className="project-card"
                style={{ "--reveal-delay": `${Math.min(idx * 2, 6) * 80}ms` } as React.CSSProperties}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onClick={() => setActiveModal(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveModal(project);
                  }
                }}
                aria-label={`Open preview for ${project.title}`}
              >
                <div className="project-frame">
                  <img src={project.image} alt={project.title} className="project-img" loading="lazy" />
                  <div className="card-overlay" />
                  <div className="card-content">
                    <div className="card-top-row">
                      <span className="card-meta-client">
                        <span>ROLE</span>
                        {project.role}
                      </span>
                    </div>
                    <div className="card-center">
                      <span className="card-badge">{project.categoryLabel}</span>
                      <h4 className="card-title">{project.title}</h4>
                    </div>
                    <div className="card-bottom-row">
                      <span className="card-meta-date">
                        <span>YEAR</span>
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`projects-col projects-col--right ${filter === "all" ? "is-staggered" : ""}`}>
            {rightColProjects.map((project, idx) => (
              <div
                key={project.slug}
                className="project-card"
                style={{ "--reveal-delay": `${Math.min(idx * 2 + 1, 7) * 80}ms` } as React.CSSProperties}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onClick={() => setActiveModal(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveModal(project);
                  }
                }}
                aria-label={`Open preview for ${project.title}`}
              >
                <div className="project-frame">
                  <img src={project.image} alt={project.title} className="project-img" loading="lazy" />
                  <div className="card-overlay" />
                  <div className="card-content">
                    <div className="card-top-row">
                      <span className="card-meta-client">
                        <span>ROLE</span>
                        {project.role}
                      </span>
                    </div>
                    <div className="card-center">
                      <span className="card-badge">{project.categoryLabel}</span>
                      <h4 className="card-title">{project.title}</h4>
                    </div>
                    <div className="card-bottom-row">
                      <span className="card-meta-date">
                        <span>YEAR</span>
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Pre-Footer CTA & Marquee Section */}
        <section className="cta-section" id="cta" aria-labelledby="ctaHeading">
          <div className="cta-sticky-stage">
            <div className="projects-cta-copy">
              <h2 id="ctaHeading">Have a project in mind?</h2>
              <PortfolioButton href={`mailto:${siteConfig.email}`} label="Let’s talk" variant="secondary" />
            </div>

            <div className="cta-scroll-spacer" aria-hidden="true" />
          </div>

          <div className="marquee-viewport" aria-label="Project UI snapshots ticker">
            <ul className="marquee-track">
              {[0, 1].flatMap((copy) =>
                marqueeItems.map((item) => (
                  <li key={`${copy}-${item.src}`} className="ticker-item" aria-hidden={copy === 1 || undefined}>
                    <Image src={item.src} alt={copy === 0 ? item.alt : ""} fill sizes="320px" />
                  </li>
                )),
              )}
            </ul>
          </div>
        </section>
      </section>

      {/* 4. Single Project Modal Preview */}
      {activeModal && (
        <div className="project-modal is-open" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div
            className="project-modal-backdrop"
            onClick={() => setActiveModal(null)}
            aria-hidden="true"
          />
          <div className="project-modal-sheet">
            <img src={activeModal.image} alt={activeModal.title} className="project-modal-img" />
            <div className="project-modal-overlay" />
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close project modal"
            >
              ×
            </button>
            <div className="project-modal-body">
              <span className="modal-eyebrow">
                {activeModal.categoryLabel} · {activeModal.role}
              </span>
              <h2 className="modal-title" id="modalTitle">
                {activeModal.title}
              </h2>
              <p className="modal-summary">{activeModal.summary}</p>
              <div className="modal-stack-row">
                {activeModal.stack.map((tech) => (
                  <span key={tech} className="modal-stack-pill">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="modal-meta-row">
                <span>{activeModal.metric}</span>
                <span>YEAR {activeModal.year}</span>
              </div>
              <Link href={`/projects/${activeModal.slug}`} className="modal-case-cta">
                View Full Case Study →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
