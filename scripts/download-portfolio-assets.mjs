import { mkdir, writeFile } from "node:fs/promises";

const destination = new URL("../public/images/projects/", import.meta.url);
const cdn = "https://cdn.sanity.io/images/pka0c0l0/production/";
const images = [
  ["mihailove", "9395fccaf2a0f50ac5e1f478ebd1be397ddb5268-1440x1698.png"],
  ["mihailove-hover", "bc147e801b9e7a8d05883063a695fb6d9894fc8e-2400x1306.png"],
  ["frame", "7f9817871110af85ee68826e2c402c8534b4cc03-1440x1698.png"],
  ["frame-hover", "1c4e3567e9d6a865cd5e7cb5fc65379abc00acd5-2400x1306.png"],
  [
    "portfolio-ventures",
    "d542e0740df5e6200eb1b958674f0bc141b83237-1440x1698.png",
  ],
  [
    "portfolio-ventures-hover",
    "513093ecae0df5f3582a328ade77575913405d26-2400x1306.png",
  ],
  ["manypixels", "73a5abc6bbeacc8a8380ce43b2fa889b256ebde6-1080x1320.jpg"],
  [
    "manypixels-hover",
    "fdd04734314f16dcd5c06b4d002a64b81d93d18e-1080x1320.jpg",
  ],
];

await mkdir(destination, { recursive: true });
for (const [name, source] of images) {
  const response = await fetch(`${cdn}${source}?w=1440&fm=webp&q=90`);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  await writeFile(
    new URL(`${name}.webp`, destination),
    Buffer.from(await response.arrayBuffer()),
  );
  console.log(`Downloaded ${name}`);
}

const font = await fetch(
  "https://www.awakeagency.dev/_next/static/immutable/media/Aeonik_Medium-s.p.0um2v56wren_e.woff2",
);
if (!font.ok) throw new Error(`Font: HTTP ${font.status}`);
await writeFile(
  new URL("../public/fonts/aeonik-medium.woff2", import.meta.url),
  Buffer.from(await font.arrayBuffer()),
);
console.log("Downloaded portfolio font");
