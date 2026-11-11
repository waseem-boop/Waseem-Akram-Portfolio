"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { services } from "@/data/services";
import ServicePreview, {
  ServiceImage,
} from "@/components/visuals/ServicePreview";
import { useServiceAnimation } from "@/hooks/useServiceAnimation";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const control = useServiceAnimation(
    sectionRef,
    floatingRef,
    mounted,
    paused,
    setActive,
  );
  useEffect(() => {
    setMounted(true);
  }, []);
  const count = String(services.items.length).padStart(2, "0");
  const selected = services.items[active];
  const number = String(active + 1).padStart(2, "0");

  return (
    <section
      className="services-section"
      id="services"
      aria-labelledby="services-heading"
      ref={sectionRef}
    >
      <div className="services-head">
        <h2 id="services-heading">
          {services.heading} ({count})
        </h2>
        <div className="services-head-end">
          <button
            className="services-motion-toggle"
            type="button"
            aria-label={paused ? "Play preview motion" : "Pause preview motion"}
            aria-pressed={paused}
            title={paused ? "Play preview motion" : "Pause preview motion"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={15} aria-hidden="true" />
            ) : (
              <Pause size={15} aria-hidden="true" />
            )}
          </button>
          <span className="services-caption">{services.caption}</span>
        </div>
      </div>
      <div className="services-grid">
        <div className="services-list">
          {services.items.map((service, index) => (
            <Link
              href={service.href}
              className="service-row"
              key={service.id}
              data-current={active === index}
              aria-label={`Discuss ${service.name}`}
            >
              <span className="service-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="service-name">
                {service.lines.map((line) => (
                  <span className="service-name-line" key={line}>
                    {line}
                  </span>
                ))}
              </div>
              <span className="service-type">
                {index === 2 ? "App" : index === 3 ? "Shop" : "Web"}
              </span>
              <div className="service-details">
                <span>{service.detail}</span>
                <span className="service-tag">({service.tag})</span>
                <span className="service-cta" aria-hidden="true">
                  Let&apos;s talk <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
          <div className="services-list-end" />
        </div>
        <div className="services-column">
          <div className="services-dock">
            <div
              className="services-frame"
              onPointerDown={(event) => {
                swipe.current =
                  event.button === 0
                    ? { x: event.clientX, y: event.clientY }
                    : null;
              }}
              onPointerCancel={() => {
                swipe.current = null;
              }}
              onPointerUp={(event) => {
                const start = swipe.current;
                swipe.current = null;
                if (!start) return;
                const x = event.clientX - start.x;
                const y = event.clientY - start.y;
                if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y))
                  control.current.slide = Math.max(
                    0,
                    Math.min(2, control.current.slide + (x < 0 ? 1 : -1)),
                  );
              }}
            >
              <div className="services-rest" aria-hidden="true">
                <ServiceImage src={selected.cover} alt={selected.alt} />
              </div>
              <span className="services-big-number" aria-hidden="true">
                {number}
              </span>
              <div className="service-mobile-stage" aria-hidden="true">
                {services.items.map((service, index) => (
                  <div
                    className="service-stage-layer"
                    key={service.id}
                    data-current={active === index}
                  >
                    <ServicePreview service={service} mobile />
                  </div>
                ))}
              </div>
            </div>
            <div className="services-preview-meta">
              <span>
                (<span className="services-current">{number}</span> / {count})
              </span>
              <span>{selected.platform}</span>
            </div>
            <div className="services-progress" aria-hidden="true">
              <div className="services-progress-bar" />
            </div>
            <div
              className="service-slide-dots"
              aria-label="Service preview images"
            >
              {[0, 1, 2].map((index) => (
                <button
                  type="button"
                  className="service-slide-dot"
                  key={index}
                  data-current={index === 0}
                  aria-label={`Show preview image ${index + 1}`}
                  title={`Preview ${index + 1}`}
                  onClick={() => {
                    control.current.slide = index;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {mounted &&
        createPortal(
          <>
            <div
              ref={floatingRef}
              className="services-floating"
              aria-hidden="true"
            >
              {services.items.map((service, index) => (
                <div
                  className="service-floating-layer"
                  data-current={active === index}
                  key={service.id}
                >
                  <ServicePreview service={service} />
                </div>
              ))}
            </div>
            <div
              className="service-pointer"
              id="service-pointer"
              aria-hidden="true"
            >
              Talk
            </div>
          </>,
          document.body,
        )}
    </section>
  );
}
