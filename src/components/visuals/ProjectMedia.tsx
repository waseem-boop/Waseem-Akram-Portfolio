"use client";

import { useRef } from "react";
import Image from "next/image";
import { useProjectImage } from "@/hooks/useProjectImage";

type Props = { image: string; hoverImage: string; alt: string };

export default function ProjectMedia({ image, hoverImage, alt }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useProjectImage(ref);
  const sizes =
    "(max-width: 767px) calc(100vw - 24px), (max-width: 1439px) calc((100vw - 80px) / 2), 26.3889vw";
  return (
    <span className="project-media" ref={ref}>
      <Image
        className="project-image project-image-base"
        src={image}
        alt={alt}
        width={380}
        height={440}
        sizes={sizes}
      />
      <Image
        className="project-image project-image-hover"
        src={hoverImage}
        alt=""
        aria-hidden="true"
        width={380}
        height={440}
        sizes={sizes}
      />
      <canvas className="project-canvas" aria-hidden="true" />
    </span>
  );
}
