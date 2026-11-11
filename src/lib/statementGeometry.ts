export type Point = { x: number; y: number };
export type Segment =
  | { kind: "line"; start: Point; end: Point }
  | {
      kind: "curve";
      start: Point;
      control1: Point;
      control2: Point;
      end: Point;
    };
export type Contour = readonly Segment[];
export type DrawWindow = readonly [number, number];
export type StrokeTrack = {
  kind: "open" | "loop";
  length: number;
  from: number;
  draw: DrawWindow;
  retract?: DrawWindow;
};

const point = (x: number, y: number): Point => ({ x, y });
const line = (start: Point, end: Point): Segment => ({
  kind: "line",
  start,
  end,
});
const curve = (
  start: Point,
  control1: Point,
  control2: Point,
  end: Point,
): Segment => ({ kind: "curve", start, control1, control2, end });
const top = point(60, 6);
const right = point(96, 42);
const bottom = point(60, 78);
const left = point(24, 42);
const handle = 36 * 0.5523;

export const formContours: readonly Contour[] = [
  [
    line(point(0, 44), point(58, 44)),
    line(point(58, 44), point(58, 102)),
    line(point(58, 102), point(0, 102)),
    line(point(0, 102), point(0, 44)),
  ],
  [
    curve(top, point(60 + handle, 6), point(96, 42 - handle), right),
    curve(right, point(96, 42 + handle), point(60 + handle, 78), bottom),
    curve(bottom, point(60 - handle, 78), point(24, 42 + handle), left),
    curve(left, point(24, 42 - handle), point(60 - handle, 6), top),
  ],
];

export function contourPath(
  contour: Contour,
  project: (point: Point) => Point,
): string {
  const coordinates = (point: Point) => {
    const mapped = project(point);
    return `${mapped.x.toFixed(2)} ${mapped.y.toFixed(2)}`;
  };
  return (
    `M${coordinates(contour[0].start)}` +
    contour
      .map((segment) =>
        segment.kind === "line"
          ? `L${coordinates(segment.end)}`
          : `C${coordinates(segment.control1)} ${coordinates(segment.control2)} ${coordinates(segment.end)}`,
      )
      .join("") +
    "Z"
  );
}

export function windowProgress(
  progress: number,
  [start, end]: DrawWindow,
): number {
  return Math.max(
    0,
    Math.min(1, (progress - start) / Math.max(0.000001, end - start)),
  );
}

export function strokePose(progress: number, track: StrokeTrack) {
  const draw = windowProgress(progress, track.draw);
  const retract = track.retract ? windowProgress(progress, track.retract) : 0;
  const length = track.length;
  if (draw <= 0 || retract >= 1)
    return { visible: false, dash: `0 ${length}`, offset: 0 };
  if (track.kind === "open")
    return {
      visible: true,
      dash: `${Math.max(0, draw - retract) * length} ${2 * length + 1}`,
      offset: -retract * length,
    };
  if (retract > 0)
    return {
      visible: true,
      dash: `${(1 - retract) * length} ${retract * length}`,
      offset: -(track.from + (retract * length) / 2),
    };
  const visibleLength = draw * length;
  return {
    visible: true,
    dash: `${visibleLength} ${length - visibleLength}`,
    offset: -(track.from - visibleLength / 2),
  };
}
