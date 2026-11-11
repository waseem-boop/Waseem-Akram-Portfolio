import { mkdir, writeFile } from "node:fs/promises";

const root = new URL("../public/images/services/", import.meta.url);
const media = "https://9jombptrb8huankv.public.blob.vercel-storage.com/";
const files = [
  [
    "web-cover.jpg",
    "ad4fc95a-a7ca-4571-a73b-251d4b43d423/digital-media-team-mobile-4x5-1e56125a.jpg",
  ],
  ["web-screen.jpg", "digital-media-team-home-scroll-poster.jpg"],
  [
    "web-detail.jpg",
    "b54a0782-9ca0-4b42-8f53-17d8bd7f107b/digital-media-team-detail-4x5-287ea078.jpg",
  ],
  [
    "app-cover.jpg",
    "9c07fa8c-d9c8-4ade-ae72-08897f33888b/fun-arena-cover-4x5-623ae438.jpg",
  ],
  ["app-screen.jpg", "fun-arena-screen-home-9x16.jpg"],
  ["app-detail.jpg", "fun-arena-screen-rewards-9x16.jpg"],
  [
    "app-stage.jpg",
    "055b9fff-0813-4ce2-bc4b-d595bbdc9ca3/fun-arena-hero-16x9-ee25e157.jpg",
  ],
  [
    "commerce-cover.jpg",
    "64ca9ff2-7c60-4573-8e0d-a2a41e3b43e6/wellpaws-mobile-4x5-d2f5e933.jpg",
  ],
  ["commerce-screen.jpg", "wellpaws-home-scroll-poster.jpg"],
  [
    "commerce-detail.jpg",
    "2d5af29e-23b5-4c8e-8985-35a2d3cd6034/wellpaws-detail-4x5-c7bbe9b6.jpg",
  ],
];

await mkdir(root, { recursive: true });
for (const [name, source] of files) {
  const response = await fetch(media + source);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  await writeFile(
    new URL(name, root),
    Buffer.from(await response.arrayBuffer()),
  );
  console.log(`Downloaded ${name}`);
}
for (const [name, source] of [
  ["archivo-variable.woff2", "21ca8f3f56c22ca2-s.p.14a9xpaqsbppk.woff2"],
  ["geist-mono.woff2", "797e433ab948586e.p.1v5bejj26fx9h.woff2"],
]) {
  const response = await fetch(
    `https://mikewilcockdesign.com/_next/static/immutable/media/${source}`,
  );
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  await writeFile(
    new URL(`../public/fonts/${name}`, import.meta.url),
    Buffer.from(await response.arrayBuffer()),
  );
  console.log(`Downloaded ${name}`);
}
