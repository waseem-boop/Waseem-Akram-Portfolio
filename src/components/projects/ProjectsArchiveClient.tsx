"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  projectsData,
  projectCategoryFilters,
  type ProjectCategoryGroup,
} from "@/data/projects";

export default function ProjectsArchiveClient() {
  const [activeFilter, setActiveFilter] = useState<"All" | ProjectCategoryGroup>("All");

  const filtered =
    activeFilter === "All"
      ? projectsData
      : projectsData.filter((project) => project.categoryGroup === activeFilter);

  return (
    <>
      <div className="projects-filter-bar">
        <div className="projects-filters" role="tablist" aria-label="Filter projects by category">
          {projectCategoryFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              data-active={activeFilter === filter}
              className="projects-filter-btn"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <p className="projects-count">
          Showing {filtered.length} of {projectsData.length} projects
        </p>
      </div>

      <div className="projects-grid">
        {filtered.map((project) => {
          const originalIndex = projectsData.findIndex((p) => p.slug === project.slug) + 1;
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-archive-card"
            >
              <div className="project-archive-media">
                <Image
                  src={project.coverImage}
                  alt={project.coverAlt}
                  width={1200}
                  height={750}
                  sizes="(max-width: 991px) 100vw, 620px"
                />
              </div>
              <div className="project-archive-body">
                <div className="project-archive-meta">
                  <span>{String(originalIndex).padStart(2, "0")} · {project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h2>{project.name}</h2>
                <p className="project-archive-tagline">{project.tagline}</p>
                <div className="project-stack-pills">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="project-stack-pill">
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="project-archive-cta">
                  Read case study <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
