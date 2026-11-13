"use client";

import { useRef } from "react";
import Image from "next/image";
import { Flag, Search, Route, PencilRuler, Code2, Workflow, CircleCheck, Rocket } from "lucide-react";
import { processShowcase } from "@/data/processShowcase";
import { useProcessWall } from "@/hooks/useKreativeSections";

const icons = [Flag, Search, Route, PencilRuler, Code2, Workflow, CircleCheck, Rocket];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  useProcessWall(ref);
  return (
    <section className="process-wall" id="process" ref={ref} aria-labelledby="process-heading">
      <div className="process-wall-sticky">
        <header className="process-wall-heading">
          <p className="process-wall-eyebrow">{processShowcase.eyebrow}</p>
          <h2 id="process-heading">{processShowcase.heading}</h2>
          <p className="process-wall-description">{processShowcase.description}</p>
        </header>
        <ol className="process-wall-cards" aria-label="Project process">
          {processShowcase.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <li className="process-wall-card" key={step.id} data-position={index + 1}>
                <Image src={step.imageUrl} alt="" fill sizes="(max-width: 767px) 100vw, 300px" />
                <div className="process-wall-copy">
                  <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
