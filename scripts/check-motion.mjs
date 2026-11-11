import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/statementGeometry.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { strokePose, windowProgress, formContours, contourPath } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

assert.equal(formContours.length, 2);
assert.equal(formContours[0].length, 4);
assert.equal(formContours[1].length, 4);
assert(formContours[1].every((segment) => segment.kind === "curve"));
for (const contour of formContours) {
  const path = contourPath(contour, ({ x, y }) => ({
    x: 300 + x * 5,
    y: 100 + y * 5,
  }));
  assert(path.startsWith("M") && path.endsWith("Z"));
  assert(!/NaN|undefined|Infinity/.test(path));
}

const outline = {
  kind: "loop",
  length: 400,
  from: 40,
  draw: [0.3, 0.62],
  retract: [0.87, 1],
};
assert.equal(strokePose(0.3, outline).visible, false);
const half = strokePose(0.46, outline);
assert(half.visible);
assert(Math.abs(Number(half.dash.split(" ")[0]) - 200) < 0.00001);
assert(Math.abs(half.offset - 60) < 0.00001);
assert.equal(strokePose(1, outline).visible, false);
const ink = { ...outline, draw: [0.48, 0.86], retract: undefined };
assert.equal(strokePose(1, ink).visible, true);
const guide = {
  kind: "open",
  length: 500,
  from: 0,
  draw: [0, 0.16],
  retract: [0.87, 1],
};
assert.equal(strokePose(0.08, guide).dash, "250 1001");
assert.equal(strokePose(1, guide).visible, false);
assert.equal(windowProgress(-1, [0, 1]), 0);
assert.equal(windowProgress(2, [0, 1]), 1);

for (let frame = 0; frame <= 240; frame++) {
  const progress = frame / 240;
  for (const track of [outline, ink, guide]) {
    const pose = strokePose(progress, track);
    assert(Number.isFinite(pose.offset));
    assert(
      pose.dash
        .split(" ")
        .every(
          (value) =>
            Number.isFinite(Number(value)) && Number(value) >= -0.000001,
        ),
    );
  }
}
console.log(
  "Motion checks passed: contour geometry, bilateral drawing, traced ink, retraction and 241 scroll positions.",
);
