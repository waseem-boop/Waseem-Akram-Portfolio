"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectSnapshot } from "@/data/projects";

type Props = {
  projectName: string;
  snapshots: ProjectSnapshot[];
};

export default function ProjectGallery({ projectName, snapshots }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const current = snapshots[activeIndex] ?? snapshots[0];
  const prev = () => setActiveIndex((i) => (i - 1 + snapshots.length) % snapshots.length);
  const next = () => setActiveIndex((i) => (i + 1) % snapshots.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + snapshots.length) % snapshots.length);
      if (event.key === "ArrowRight") setActiveIndex((i) => (i + 1) % snapshots.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, snapshots.length]);

  return (
    <section className="case-gallery-section" aria-label={`${projectName} interface snapshots`}>
      <div className="case-gallery-header">
        <div>
          <p className="projects-eyebrow">Product Walkthrough</p>
          <h2>Interface & Module Snapshots</h2>
        </div>
        <div className="case-gallery-controls">
          <button
            type="button"
            className="case-gallery-nav-btn"
            aria-label="Previous snapshot"
            onClick={prev}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="case-gallery-nav-btn"
            aria-label="Next snapshot"
            onClick={next}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="case-gallery-stage">
        <button
          type="button"
          className="case-gallery-image-btn"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Expand snapshot: ${current.title}`}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={1200}
            height={750}
            sizes="(max-width: 1320px) 100vw, 1272px"
          />
        </button>
        <div className="case-gallery-caption">
          <div>
            <h3>{current.title}</h3>
            <p>{current.caption}</p>
          </div>
          <span className="case-gallery-counter">
            {String(activeIndex + 1).padStart(2, "0")} / {String(snapshots.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="case-gallery-thumbs" role="tablist" aria-label="Select snapshot">
        {snapshots.map((snap, index) => (
          <button
            key={snap.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            data-active={index === activeIndex}
            className="case-thumb-btn"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={snap.src}
              alt={snap.alt}
              width={320}
              height={200}
              sizes="(max-width: 640px) 45vw, 240px"
            />
            <span className="case-thumb-title">{snap.title}</span>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="case-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} — ${current.title}`}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="case-lightbox-close"
            aria-label="Close expanded snapshot"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={20} />
          </button>
          <img
            src={current.src}
            alt={current.alt}
            onClick={(event) => event.stopPropagation()}
          />
          <p className="case-lightbox-caption">
            <strong>{current.title}</strong> — {current.caption}
          </p>
        </div>
      )}
    </section>
  );
}

