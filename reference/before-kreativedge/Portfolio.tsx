"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import ProjectMedia from "@/components/visuals/ProjectMedia";
import { portfolio } from "@/data/portfolio";
import { usePortfolioAnimation } from "@/hooks/usePortfolioAnimation";

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  usePortfolioAnimation(ref);
  return (
    <section
      className="portfolio-section"
      id="projects"
      aria-labelledby="portfolio-title"
      ref={ref}
    >
      <div className="portfolio-selected">
        <h2 className="portfolio-heading" id="portfolio-title">
          {portfolio.heading}
        </h2>
        <div className="portfolio-stage">
          <svg
            className="portfolio-thread"
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="none"
          >
            <path />
          </svg>
          <ul className="portfolio-grid">
            {portfolio.featured.map((project) => (
              <li
                className="portfolio-item"
                key={project.slug}
                style={
                  {
                    "--project-x": `${project.x}vw`,
                    "--project-y": `${project.y}vw`,
                  } as CSSProperties
                }
              >
                <Link
                  className="project-card"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="project-thumbnail">
                    <ProjectMedia
                      image={project.image}
                      hoverImage={project.hoverImage}
                      alt={project.alt}
                    />
                  </span>
                  <span className="project-meta">
                    <span className="project-discipline">
                      {project.discipline}
                    </span>
                    <span className="project-title">{project.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
