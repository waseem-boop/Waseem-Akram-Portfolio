"use client";

import { useRef } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useStatementAnimation } from "@/hooks/useStatementAnimation";
import StatementDraft from "@/components/visuals/StatementDraft";

export default function Statement() {
  const section = useRef<HTMLElement>(null);
  useStatementAnimation(section);

  return (
    <section
      ref={section}
      id="about"
      className="statement-scroll"
      aria-labelledby="statement-title"
    >
      <div className="statement-section">
      <StatementDraft />
      <h2 id="statement-title" className="sr-only">
        {siteConfig.statement.paragraphs.join(" ")}
      </h2>
      <div className="statement-stack" aria-hidden="true">
        {siteConfig.statement.paragraphs.map((paragraph, index) => (
          <p className="statement-text" key={paragraph}>
            {index === siteConfig.statement.paragraphs.length - 1
              ? <>{paragraph.slice(0, -1)}<span className="statement-period">.</span></>
              : paragraph}
          </p>
        ))}
      </div>
      </div>
    </section>
  );
}
