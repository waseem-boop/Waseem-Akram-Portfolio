import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/portfolioGeometry.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const {
  spline,
  projectThread,
  sampleReach,
  drawnAtReach,
  drawnAtSectionReach,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
assert.equal(spline([]).path, "");
for (const width of [320, 390, 768, 1280, 1440, 1920, 2261]) {
  const desktop = width >= 1440;
  const columns = width < 768 ? 1 : 2;
  const cardWidth = desktop
    ? width * 0.263889
    : (width - 40 - (columns - 1) * 40) / columns;
  const height = desktop
    ? width * 1.214583
    : (4 / columns) * ((cardWidth * 440) / 380 + 150);
  const coordinates = [
    [0.088889, 0],
    [0.661806, 0.239583],
    [0.153472, 0.563194],
    [0.570833, 0.859028],
  ];
  const cards = coordinates.map(([x, y], index) => ({
    x: desktop ? width * x : (index % columns) * (cardWidth + 40),
    y: desktop
      ? width * y
      : Math.floor(index / columns) * ((cardWidth * 440) / 380 + 150),
    w: cardWidth,
    h: (cardWidth * 440) / 380 + 76,
  }));
  const thread = projectThread(cards, width, height, 28);
  assert(thread.path.startsWith("M"));
  assert(!/NaN|Infinity|undefined/.test(thread.path));
  assert.equal(thread.segments.at(-1)[3].y, height);
  const samples = sampleReach(thread.segments, 10000);
  samples.forEach((sample, index) => {
    if (index === 0) return;
    assert(sample.reach >= samples[index - 1].reach);
    assert(sample.at >= samples[index - 1].at);
  });
  assert.equal(drawnAtReach(samples, -10000, 10000), 0);
  assert.equal(drawnAtReach(samples, 100000, 10000), 10000);
  let previous = 0;
  for (let step = 0; step < 240; step++) {
    const drawn = drawnAtReach(samples, (step / 239) * height, 10000);
    assert(drawn >= previous && drawn <= 10000);
    previous = drawn;
  }
  for (const viewportHeight of [568, 844, 900, 1200]) {
    const sectionHeight = height + Math.max(128, width * 0.1);
    const completionReach = sectionHeight - viewportHeight * 0.34;
    assert.equal(
      drawnAtSectionReach(samples, completionReach, 10000, completionReach),
      10000,
    );
    assert.equal(
      drawnAtSectionReach(
        samples,
        completionReach + 200,
        10000,
        completionReach,
      ),
      10000,
    );
    assert.equal(
      drawnAtSectionReach(
        samples,
        samples[0].reach - 1,
        10000,
        completionReach,
      ),
      0,
    );
    let prior = 0;
    for (let step = 0; step <= 300; step++) {
      const reach =
        samples[0].reach + (step / 300) * (completionReach - samples[0].reach);
      const drawn = drawnAtSectionReach(samples, reach, 10000, completionReach);
      assert(drawn >= prior && drawn <= 10000);
      prior = drawn;
    }
    assert.equal(prior, 10000);
  }
}
for (const slug of [
  "mihailove",
  "mihailove-hover",
  "frame",
  "frame-hover",
  "portfolio-ventures",
  "portfolio-ventures-hover",
  "manypixels",
  "manypixels-hover",
]) {
  assert(
    (
      await stat(
        new URL(`../public/images/projects/${slug}.webp`, import.meta.url),
      )
    ).size > 1000,
  );
}
assert(
  (await stat(new URL("../public/fonts/aeonik-medium.woff2", import.meta.url)))
    .size > 1000,
);
console.log(
  "Portfolio checks passed: seven widths x four viewport heights, full-section drawing completion, monotonic scroll drawing and all local assets.",
);
