"use client";

import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import RipplePortrait from "@/components/visuals/RipplePortrait";

export default function Hero({ repeat = false }: { repeat?: boolean }) {

  return (
    <section className="hero" id={repeat ? undefined : "hero"} aria-labelledby={repeat ? undefined : "hero-title"} aria-hidden={repeat || undefined} inert={repeat || undefined} data-loop-hero={repeat || undefined}>
      {!repeat && <Navbar />}
      <div className="hero-background" aria-hidden="true">
        <Image
          src={siteConfig.heroBackground}
          alt=""
          fill
          preload={!repeat}
          sizes="100vw"
          className="hero-backdrop"
        />
        <div className="hero-portrait-layer">
          <Image
            src={siteConfig.portrait}
            alt=""
            fill
            preload={!repeat}
            sizes="(max-width: 809px) 215vw, 1200px"
            className="hero-portrait"
          />
        </div>
        {!repeat && <RipplePortrait />}
      </div>
      <div className="hero-content">
        <div className="hero-top">
          <p className="hero-descriptor">
            {siteConfig.hero.descriptor[0]}
            <br />
            {siteConfig.hero.descriptor[1]}
          </p>
        </div>
        <div className="hero-bottom">
          <div className="hero-heading-row">
            <h1
              className="hero-first-name"
              id={repeat ? undefined : "hero-title"}
              aria-label={siteConfig.name}
            >
              <svg className="hero-word" viewBox="0 0 816 180" width="816" height="180" aria-hidden="true" focusable="false">
                <text x="0" y="155.5" fontSize="180" textLength="816" lengthAdjust="spacingAndGlyphs">{siteConfig.hero.firstName}</text>
              </svg>
            </h1>
            <div className="hero-roles">
              {siteConfig.hero.roles.map((role) => (
                <p className="hero-role" key={role.firstLine}>
                  {role.firstLine}
                  <br />
                  {role.secondLine}
                </p>
              ))}
            </div>
          </div>
          <div className="hero-last-name" aria-hidden="true">
            <svg className="hero-word" viewBox="0 0 1151 245.6" width="1151" height="245.6" aria-hidden="true" focusable="false">
              <text x="0" y="234.3" fontSize="307" textLength="1151" lengthAdjust="spacingAndGlyphs">{siteConfig.hero.lastName}</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
