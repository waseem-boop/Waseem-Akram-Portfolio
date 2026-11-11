"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { selectedWork } from "@/data/selectedWork";
import { kreativeFont } from "@/styles/kreativeFont";
import { useSelectedWork } from "@/hooks/useKreativeSections";

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  useSelectedWork(ref);
  return (
    <section className={`selected-work ${kreativeFont.className}`} id="projects" ref={ref} aria-labelledby="portfolio-title">
      <div className="work-container">
        <header className="work-header">
          <p>{selectedWork.eyebrow}</p>
          <h2 id="portfolio-title">{selectedWork.heading}</h2>
        </header>
        <ol className="work-list">
          {selectedWork.items.map((project, index) => (
            <li className="work-item" key={project.slug} data-work-index={index}>
              <Link className="work-card" href={project.href} target="_blank" rel="noopener noreferrer">
                <div className="work-image">
                  <Image src={project.image} alt={project.alt} width={520} height={451} sizes="(max-width: 991px) 100vw, 520px" />
                  <div className="work-image-shade" />
                </div>
                <div className="work-tag-wrap"><p className="work-tag">{project.category}</p></div>
                <div className="work-card-title">
                  <h3 className="work-title-motion">{project.title.map((line) => <span key={line}>{line}</span>)}</h3>
                </div>
                <span className="work-number" aria-hidden="true"><span className="work-number-circle" /><span className="work-number-text">{String(index + 1).padStart(2, "0")}</span></span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
