"use client";

import { useRef, type CSSProperties } from "react";
import { Flag, PencilRuler, Code2, Rocket } from "lucide-react";
import { processContent } from "@/data/process";
import { processLayouts } from "@/lib/processGeometry";
import { useProcessAnimation } from "@/hooks/useProcessAnimation";
import ProcessDiagram from "@/components/visuals/ProcessDiagram";

const icons = [Flag, PencilRuler, Code2, Rocket];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  useProcessAnimation(ref);
  return (
    <section
      className="process-section"
      id="process"
      aria-labelledby="process-heading"
      ref={ref}
      data-process-motion="pending"
    >
      <div className="process-screen">
        <header className="process-header">
          <p className="process-eyebrow">{processContent.eyebrow} / 04</p>
          <h2 id="process-heading">{processContent.heading}</h2>
        </header>
        <div className="process-stage">
          <div className="process-diagram">
            <ProcessDiagram />
            <ol className="process-steps" aria-label="Project process">
              {processContent.steps.map((step, index) => {
                const Icon = icons[index];
                const desktop = processLayouts.desktop.nodes[index];
                const mobile = processLayouts.mobile.nodes[index];
                return (
                  <li
                    className="process-step"
                    key={step.id}
                    data-state="upcoming"
                    style={
                      {
                        "--node-x": `${desktop.x}%`,
                        "--node-y": `${desktop.y}%`,
                        "--mobile-x": `${mobile.x}%`,
                        "--mobile-y": `${mobile.y}%`,
                      } as CSSProperties
                    }
                  >
                    <div className="process-node-position">
                      <button
                        className="process-node"
                        type="button"
                        aria-label={`Go to step ${index + 1}: ${step.title}`}
                        title={`Step ${index + 1}: ${step.title}`}
                      >
                        <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="process-step-copy">
                      <div className="process-copy-reveal">
                        <span
                          className="process-step-number"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <footer className="process-footer">
          <p>{processContent.caption}</p>
          <span className="process-counter" aria-hidden="true">
            <span className="process-counter-current">00</span>
            <span> / 04</span>
          </span>
        </footer>
        <p
          className="process-announcement"
          aria-live="polite"
          aria-atomic="true"
        />
      </div>
      <noscript>
        <style>{`.process-section{height:100vh}.process-screen{position:relative}.process-node,.process-copy-reveal,.process-footer{opacity:1!important;visibility:visible!important;transform:none!important}.process-curve-draw{stroke-dashoffset:0!important;visibility:visible!important}`}</style>
      </noscript>
    </section>
  );
}
