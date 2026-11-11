import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/serviceMotion.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { closestRow, easeOut, lerpFactor, rowTypography, serviceMotion } =
  await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
assert.deepEqual(rowTypography(0), { width: 88, weight: 700, opacity: 0.5 });
assert.deepEqual(rowTypography(1), { width: 118, weight: 400, opacity: 1 });
assert.deepEqual(rowTypography(-2), rowTypography(0));
assert.deepEqual(rowTypography(3), rowTypography(1));
assert.equal(serviceMotion.dwell, 600);
assert.equal(serviceMotion.screenInterval, 1400);
assert.equal(serviceMotion.screenFade, 700);
assert.equal(serviceMotion.liftDuration, 600);
assert.equal(serviceMotion.dockDuration, 900);
assert.equal(easeOut(0), 0);
assert.equal(easeOut(1), 1);
assert(easeOut(0.5) > 0.95 && easeOut(0.5) < 0.98);
let previous = 0;
for (let frame = 0; frame <= 300; frame++) {
  const value = easeOut(frame / 300);
  assert(value >= previous && value <= 1);
  previous = value;
}
const oneFrame = lerpFactor(0.12, 1);
const halfFrame = lerpFactor(0.12, 0.5);
assert(Math.abs(oneFrame - (1 - (1 - halfFrame) ** 2)) < 0.000001);
const rows = [0, 1, 2, 3].map((index) => ({
  top: index * 400,
  center: index * 400 + 200,
  nameTop: index * 400 + 150,
  nameBottom: index * 400 + 250,
}));
for (let index = 0; index < 4; index++) {
  assert.equal(closestRow(rows, index * 400, 400), index);
  assert.equal(closestRow(rows, index * 400, 400, 100), index);
}
const config = await readFile(
  new URL("../src/data/services.ts", import.meta.url),
  "utf8",
);
for (const asset of new Set(
  config.match(/\/images\/[a-zA-Z0-9/.-]+\.(?:jpg|webp)/g),
)) {
  assert(
    (await stat(new URL(`../public${asset}`, import.meta.url))).size > 1000,
    asset,
  );
}
for (const font of ["archivo-variable.woff2", "geist-mono.woff2"])
  assert(
    (await stat(new URL(`../public/fonts/${font}`, import.meta.url))).size >
      1000,
  );
console.log(
  "Services checks passed: reference timing, variable font endpoints, frame-rate independent motion, desktop/mobile row selection and local assets.",
);
