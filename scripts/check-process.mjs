import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/processGeometry.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const {
  processLayouts,
  processState,
  processScrollDistance,
  processRoute,
  processStepReveal,
  processDrawingProgress,
  processScrollProgress,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function point(curve, t) {
  const u = 1 - t;
  const { start: a, controlA: b, controlB: c, end: d } = curve;
  return {
    x: u ** 3 * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t ** 3 * d.x,
    y: u ** 3 * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t ** 3 * d.y,
  };
}
for (const scroll of [-1, 0, 0.04, 0.1, 0.16]) {
  assert.equal(processDrawingProgress(scroll), 0);
}
assert(processDrawingProgress(0.17) > 0);
assert(processDrawingProgress(0.5) > 0 && processDrawingProgress(0.5) < 1);
assert.equal(processDrawingProgress(0.94), 1);
assert.equal(processDrawingProgress(1), 1);
for (let frame = 0; frame <= 100; frame++) {
  const progress = frame / 100;
  assert(
    Math.abs(
      processDrawingProgress(processScrollProgress(progress)) - progress,
    ) < 0.000001,
  );
}
for (const [mode, geometry] of Object.entries(processLayouts)) {
  assert.equal(geometry.nodes.length, 4);
  assert.equal(geometry.checkpoints.length, 4);
  assert.equal(geometry.curves.length, 5);
  assert(!/NaN|undefined|Infinity/.test(geometry.path));
  const lengths = [];
  geometry.curves.forEach((curve, index) => {
    if (index) assert.deepEqual(curve.start, geometry.curves[index - 1].end);
    let length = 0;
    let previous = curve.start;
    for (let step = 1; step <= 1000; step++) {
      const current = point(curve, step / 1000);
      assert(current.x >= 0 && current.x <= geometry.width + 0.00001);
      assert(current.y >= 0 && current.y <= geometry.height + 0.00001);
      length += Math.hypot(current.x - previous.x, current.y - previous.y);
      previous = current;
    }
    lengths.push(length);
    if (index < 4) {
      assert.equal(
        geometry.nodes[index].x,
        (curve.end.x / geometry.width) * 100,
      );
      assert.equal(
        geometry.nodes[index].y,
        (curve.end.y / geometry.height) * 100,
      );
    }
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let running = 0;
  const checkpoints = lengths.slice(0, 4).map((length) => {
    running += length;
    return running / total;
  });
  assert(checkpoints[0] > 0 && checkpoints[3] < 1);
  checkpoints.forEach((checkpoint, index) => {
    const next = checkpoints[index + 1] ?? 1;
    for (const scroll of [0, 0.08, 0.16]) {
      assert.deepEqual(
        processStepReveal(processDrawingProgress(scroll), checkpoint, next),
        { node: 0, copy: 0 },
      );
    }
    assert.deepEqual(processStepReveal(0, checkpoint, next), {
      node: 0,
      copy: 0,
    });
    assert.deepEqual(processStepReveal(checkpoint - 0.001, checkpoint, next), {
      node: 0,
      copy: 0,
    });
    assert.deepEqual(processStepReveal(1, checkpoint, next), {
      node: 1,
      copy: 1,
    });
    const during = processStepReveal(checkpoint + 0.02, checkpoint, next);
    assert(during.node > 0 && during.node <= 1);
    assert(during.copy > 0 && during.copy < during.node);
    for (let frame = 0; frame <= 100; frame++) {
      const progress = frame / 100;
      const forward = processStepReveal(progress, checkpoint, next);
      const reverse = processStepReveal(progress, checkpoint, next);
      assert.deepEqual(forward, reverse);
      assert(forward.node >= forward.copy);
    }
  });
  for (const [width, height] of [
    [1440, 440],
    [821, 240],
    [342, 560],
    [280, 350],
  ]) {
    const route = processRoute(mode, width, height);
    assert.equal(route.width, width);
    assert.equal(route.height, height);
    route.nodes.forEach((node, index) => {
      assert(Math.abs(node.x - geometry.nodes[index].x) < 0.000001);
      assert(Math.abs(node.y - geometry.nodes[index].y) < 0.000001);
    });
    assert(!/NaN|undefined|Infinity/.test(route.path));
  }
  assert.equal(processState(0, checkpoints).active, -1);
  checkpoints.forEach((checkpoint, index) => {
    assert.equal(processState(checkpoint, checkpoints).active, index);
    assert.equal(
      processState(checkpoint - 0.0001, checkpoints).active,
      index - 1,
    );
  });
  assert.deepEqual(processState(1, checkpoints), {
    progress: 1,
    active: 3,
    completed: 4,
  });
  assert.equal(processState(-1, checkpoints).progress, 0);
  assert.equal(processState(2, checkpoints).progress, 1);
  let active = -1;
  for (let frame = 0; frame <= 300; frame++) {
    const state = processState(frame / 300, checkpoints);
    assert(state.active >= active && state.active <= 3);
    active = state.active;
  }
  for (let frame = 300; frame >= 0; frame--) {
    const state = processState(frame / 300, checkpoints);
    assert(state.active <= active);
    active = state.active;
  }
  assert.equal(active, -1);
  for (const height of [400, 568, 650, 844, 900, 1200]) {
    const distance = processScrollDistance(height, mode === "mobile");
    assert(distance >= height * 2 && distance <= height * 2.5);
  }
}
const hook = await readFile(
  new URL("../src/hooks/useProcessAnimation.ts", import.meta.url),
  "utf8",
);
assert(hook.includes('end: "bottom bottom"') && hook.includes("scrub: 0.55"));
assert(!hook.includes("pin: true"));
assert(hook.includes("processDrawingProgress(drawing.progress)"));
const diagram = await readFile(
  new URL("../src/components/visuals/ProcessDiagram.tsx", import.meta.url),
  "utf8",
);
assert.equal((diagram.match(/<path\b/g) ?? []).length, 1);
assert(!/process-curve-(echo|track)|vector-effect/.test(diagram));
assert(diagram.includes("pathLength={1}"));
console.log(
  "Process checks passed: heading-only sticky entry, alternating labels, delayed/full/reverse drawing, step navigation timing and one visible curve.",
);
