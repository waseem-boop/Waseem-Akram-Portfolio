export type Point = { x: number; y: number };
export type ProjectBox = Point & { w: number; h: number };
type Segment = [Point, Point, Point, Point];
export type ReachSample = { at: number; reach: number };

export function spline(points: Point[]) {
  const segments: Segment[] = [];
  if (points.length < 2) return { path: "", segments };
  let path = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let index = 0; index < points.length - 1; index++) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const following = points[index + 2] ?? next;
    const a = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };
    const b = {
      x: next.x - (following.x - current.x) / 6,
      y: next.y - (following.y - current.y) / 6,
    };
    segments.push([current, a, b, next]);
    path += `C${a.x.toFixed(1)} ${a.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)} ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return { path, segments };
}

export function projectThread(
  boxes: ProjectBox[],
  width: number,
  height: number,
  stroke: number,
) {
  if (!boxes.length) return spline([]);
  const first = boxes[0];
  const points: Point[] = [
    { x: -2 * stroke, y: Math.max(0, first.y - 0.35 * first.h) },
    { x: 0.02 * width, y: Math.max(0, first.y - 0.2 * first.h) },
  ];
  boxes.forEach((box, index) => {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const rx = box.w / 2 + Math.max(1.6 * stroke, 0.16 * box.w);
    const ry = box.h / 2 + Math.max(1.6 * stroke, 0.14 * box.h);
    const rotation = ((index % 2 ? 1 : -1) * 7 * Math.PI) / 180;
    const previous = points[points.length - 1];
    const start = Math.atan2(previous.y - cy, previous.x - cx);
    const direction = cx < width / 2 ? 1 : -1;
    for (let step = 0; step <= 18; step++) {
      const angle = start + (step / 18) * direction * 1.12 * Math.PI * 2;
      const growth = 1 + (step / 18) * 0.06;
      const x = Math.cos(angle) * rx * growth;
      const y = Math.sin(angle) * ry * growth;
      points.push({
        x: cx + x * Math.cos(rotation) - y * Math.sin(rotation),
        y: cy + x * Math.sin(rotation) + y * Math.cos(rotation),
      });
    }
  });
  const last = boxes[boxes.length - 1];
  points.push(
    { x: 0.98 * width, y: Math.min(height, last.y + 1.2 * last.h) },
    { x: width + 2 * stroke, y: height },
  );
  return spline(points);
}

// Map distance along the looping line to its furthest vertical reach. A linear
// dash tween would race ahead whenever a loop turns back upwards.
export function sampleReach(
  segments: Segment[],
  pathLength: number,
): ReachSample[] {
  let previous = segments[0]?.[0] ?? { x: 0, y: 0 };
  let distance = 0;
  let reach = previous.y;
  const samples = [{ at: 0, reach }];
  for (const [a, b, c, d] of segments) {
    for (let step = 1; step <= 16; step++) {
      const t = step / 16;
      const u = 1 - t;
      const point = {
        x:
          u ** 3 * a.x +
          3 * u * u * t * b.x +
          3 * u * t * t * c.x +
          t ** 3 * d.x,
        y:
          u ** 3 * a.y +
          3 * u * u * t * b.y +
          3 * u * t * t * c.y +
          t ** 3 * d.y,
      };
      distance += Math.hypot(point.x - previous.x, point.y - previous.y);
      previous = point;
      reach = Math.max(reach, point.y);
      samples.push({ at: distance, reach });
    }
  }
  const scale = distance > 0 ? pathLength / distance : 1;
  return samples.map((sample) => ({
    at: sample.at * scale,
    reach: sample.reach,
  }));
}

export function drawnAtReach(
  samples: ReachSample[],
  reach: number,
  length: number,
) {
  if (!samples.length || reach <= samples[0].reach) return 0;
  let low = 0;
  let high = samples.length - 1;
  if (reach >= samples[high].reach) return length;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (samples[middle].reach <= reach) low = middle;
    else high = middle;
  }
  return samples[low].at;
}

export function drawnAtSectionReach(
  samples: ReachSample[],
  reach: number,
  length: number,
  completionReach: number,
) {
  if (!samples.length) return 0;
  const start = samples[0].reach;
  if (reach <= start) return 0;
  if (reach >= completionReach) return length;
  const peak = samples[samples.length - 1].reach;
  // Loops can extend below their cards. Fit their vertical reach to the actual
  // visible section end so the final loop does not finish off-screen.
  const progress = (reach - start) / Math.max(1, completionReach - start);
  return drawnAtReach(samples, start + progress * (peak - start), length);
}
