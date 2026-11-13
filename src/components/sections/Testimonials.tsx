"use client";

import { useRef } from "react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import { useTestimonialStack } from "@/hooks/useKreativeSections";

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  useTestimonialStack(ref);
  return (
    <section className="testimonials-section" id="testimonials" ref={ref} aria-labelledby="testimonials-heading">
      <div className="testimonial-sticky">
        <div className="testimonial-scene">
          <header className="testimonial-header">
            <p>{testimonials.eyebrow}</p>
            <h2 id="testimonials-heading">{testimonials.heading}</h2>
          </header>
          <div className="testimonial-stack">
            {testimonials.items.map((review) => (
              <figure className="testimonial-stack-item" key={review.id}>
                <div className="testimonial-card">
                  <div className="testimonial-portrait"><Image src={review.image} alt="" fill sizes="(max-width: 767px) 100vw, 270px" /></div>
                  <div className="testimonial-copy">
                    <blockquote><p>{review.quote}</p></blockquote>
                    <figcaption>
                      <div><span className="testimonial-name">{review.name}</span><span className="testimonial-role">{review.role}</span></div>
                      <span className="testimonial-company">{review.company}</span>
                    </figcaption>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
