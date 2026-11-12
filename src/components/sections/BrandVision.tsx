"use client";

import { useRef } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { brandVision } from "@/data/brandVision";
import { useBrandVisionAnimation } from "@/hooks/useBrandVisionAnimation";

const visionFont = localFont({
  src: [
    { path: "../../../public/fonts/inter-tight-regular.ttf", weight: "400" },
    { path: "../../../public/fonts/inter-tight-semibold.ttf", weight: "600" },
  ],
  display: "swap",
  preload: false,
});

function VisionCard({ card }: { card: (typeof brandVision.cards)[number] }) {
  return (
    <article className="vision-card" data-vision-card={card.number} tabIndex={0}>
      <div className="vision-card-corner" aria-hidden="true">
        <span className="vision-card-number">{card.number}</span>
        <div className="vision-card-image">
          <Image src={card.image} alt="" fill sizes="152px" />
        </div>
      </div>
      <div className="vision-card-content">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>
    </article>
  );
}

export default function BrandVision() {
  const ref = useRef<HTMLElement>(null);
  useBrandVisionAnimation(ref);

  return (
    <section
      ref={ref}
      id="vision"
      className={`brand-vision ${visionFont.className}`}
      aria-labelledby="vision-heading"
    >
      <h2 className="vision-accessible-heading" id="vision-heading">
        {brandVision.messages[0]}
      </h2>
      <div className="vision-sticky">
        <div className="vision-scene">
          <div className="vision-columns">
            <div className="vision-column vision-column-left">
              <VisionCard card={brandVision.cards[0]} />
              <VisionCard card={brandVision.cards[2]} />
            </div>
            <div className="vision-column vision-column-right">
              <VisionCard card={brandVision.cards[1]} />
              <VisionCard card={brandVision.cards[3]} />
            </div>
          </div>
          <div className="vision-circle" aria-hidden="true">
            <div className="vision-ring vision-ring-outer" />
            <div className="vision-ring vision-ring-inner" />
            <div className="vision-messages">
              {brandVision.messages.map((message) => (
                <p className="vision-message" key={message}>
                  {message}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
