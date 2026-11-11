export type ProcessPoint = { x: number; y: number };

type Curve = {
  start: ProcessPoint;
  controlA: ProcessPoint;
  controlB: ProcessPoint;
  end: ProcessPoint;
};

function curvePath(curve: Curve) {
  const { controlA: a, controlB: b, end } = curve;
  return `C${a.x} ${a.y} ${b.x} ${b.y} ${end.x} ${end.y}`;
}

function layout(width: number, height: number, curves: Curve[]) {
  const start = curves[0].start;
  const paths = curves.map(
    (curve, index) =>
      `M${start.x} ${start.y} ${curves
        .slice(0, index + 1)
        .map(curvePath)
        .join(" ")}`,
  );
  return {
    width,
    height,
    path: paths[paths.length - 1],
    checkpoints: paths.slice(0, 4),
    nodes: curves.slice(0, 4).map((curve) => ({
      x: (curve.end.x / width) * 100,
      y: (curve.end.y / height) * 100,
    })),
    curves,
  };
}

export const processLayouts = {
  desktop: layout(1200, 480, [
    {
      start: { x: 0, y: 310 },
      controlA: { x: 38, y: 335 },
      controlB: { x: 78, y: 355 },
      end: { x: 132, y: 350 },
    },
    {
      start: { x: 132, y: 350 },
      controlA: { x: 282, y: 350 },
      controlB: { x: 300, y: 110 },
      end: { x: 432, y: 125 },
    },
    {
      start: { x: 432, y: 125 },
      controlA: { x: 590, y: 125 },
      controlB: { x: 575, y: 325 },
      end: { x: 756, y: 300 },
    },
    {
      start: { x: 756, y: 300 },
      controlA: { x: 900, y: 280 },
      controlB: { x: 930, y: 100 },
      end: { x: 1056, y: 110 },
    },
    {
      start: { x: 1056, y: 110 },
      controlA: { x: 1110, y: 115 },
      controlB: { x: 1160, y: 95 },
      end: { x: 1200, y: 70 },
    },
  ]),
  mobile: layout(360, 640, [
    {
      start: { x: 38, y: 0 },
      controlA: { x: 42, y: 20 },
      controlB: { x: 76, y: 38 },
      end: { x: 76, y: 64 },
    },
    {
      start: { x: 76, y: 64 },
      controlA: { x: 76, y: 118 },
      controlB: { x: 120, y: 160 },
      end: { x: 102, y: 224 },
    },
    {
      start: { x: 102, y: 224 },
      controlA: { x: 82, y: 286 },
      controlB: { x: 38, y: 310 },
      end: { x: 64, y: 384 },
    },
    {
      start: { x: 64, y: 384 },
      controlA: { x: 90, y: 456 },
      controlB: { x: 120, y: 474 },
      end: { x: 96, y: 544 },
    },
    {
      start: { x: 96, y: 544 },
      controlA: { x: 78, y: 596 },
      controlB: { x: 34, y: 610 },
      end: { x: 42, y: 640 },
    },
  ]),
};

export function processState(progress: number, checkpoints: number[]) {
  const value = Math.max(0, Math.min(1, progress));
  let active = -1;
  checkpoints.forEach((checkpoint, index) => {
    if (value + 0.00001 >= checkpoint) active = index;
  });
  return { progress: value, active, completed: active + 1 };
}

export function processScrollDistance(viewportHeight: number, mobile: boolean) {
  return viewportHeight * (mobile ? 2.1 : 2.4);
}

export function processRoute(
  mode: keyof typeof processLayouts,
  width: number,
  height: number,
) {
  const source = processLayouts[mode];
  const scale = (point: ProcessPoint) => ({
    x: (point.x / source.width) * width,
    y: (point.y / source.height) * height,
  });
  return layout(
    width,
    height,
    source.curves.map((curve) => ({
      start: scale(curve.start),
      controlA: scale(curve.controlA),
      controlB: scale(curve.controlB),
      end: scale(curve.end),
    })),
  );
}

export function processStepReveal(
  progress: number,
  checkpoint: number,
  next: number,
) {
  const duration = Math.min(0.055, Math.max(0.025, (next - checkpoint) * 0.45));
  const ease = (start: number) => {
    const value = Math.max(0, Math.min(1, (progress - start) / duration));
    return 1 - (1 - value) ** 3;
  };
  return { node: ease(checkpoint), copy: ease(checkpoint + 0.012) };
}

export function processDrawingProgress(scrollProgress: number) {
  // Hold the heading-only screen before the journey begins, then leave a
  // short completed-graph hold before the sticky screen releases.
  if (scrollProgress <= 0.16) return 0;
  if (scrollProgress >= 0.94) return 1;
  return (scrollProgress - 0.16) / 0.78;
}

export function processScrollProgress(drawingProgress: number) {
  return 0.16 + Math.max(0, Math.min(1, drawingProgress)) * 0.78;
}
