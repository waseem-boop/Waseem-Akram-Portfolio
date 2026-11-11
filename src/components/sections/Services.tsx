"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceShowcase } from "@/data/serviceShowcase";
import { useServiceShowcase } from "@/hooks/useServiceShowcase";

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useServiceShowcase(ref);

  return (
    <section className="services-showcase" id="services" ref={ref} aria-labelledby="services-heading">
      <div className="showcase-container showcase-title-wrap">
        <h2 className="showcase-heading" id="services-heading">{serviceShowcase.heading}</h2>
      </div>
      <div className="showcase-sticky">
        <div className="showcase-container showcase-intro-wrap">
          <p className="showcase-introduction">{serviceShowcase.introduction}</p>
        </div>
        <div className="showcase-track">
          {serviceShowcase.items.map((service) => (
            <Link href={service.href} className="showcase-card" key={service.id} aria-label={`Discuss ${service.title}`}>
              <div className="showcase-figure" aria-hidden="true">
                <Image
                  src={service.image}
                  alt=""
                  width={service.imageWidth}
                  height={service.imageHeight}
                  sizes="(max-width: 991px) 150px, 450px"
                />
              </div>
              <div className="showcase-copy">
                <h3>{service.title}</h3>
                <div className="showcase-description"><p>{service.description}</p></div>
              </div>
            </Link>
          ))}
        </div>
        <div className="showcase-marquee" aria-hidden="true">
          <div className="showcase-marquee-track">
            {[0, 1, 2].map((copy) => (
              <div className="showcase-marquee-train" key={copy}>
                {serviceShowcase.marquee.map((text) => (
                  <span key={text}>
                    <Image src="/images/services/regensia/marquee-star.svg" alt="" width={24} height={24} />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
