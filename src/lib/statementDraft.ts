import {
  contourPath,
  formContours,
  strokePose,
  windowProgress,
  type DrawWindow,
  type Point,
  type StrokeTrack,
} from "./statementGeometry";

type Bounds = { left: number; top: number; right: number; bottom: number };
type Stroke = StrokeTrack & { element: SVGPathElement };
type Marker = {
  element: SVGGraphicsElement;
  point: Point;
  at: number;
  retract?: DrawWindow;
};
type MeasuredContour = {
  element: SVGPathElement;
  length: number;
  samples: Point[];
  from: number;
  top: number;
  bottom: number;
  shortSide: number;
};
const retract: DrawWindow = [0.87, 1];
const ns = "http://www.w3.org/2000/svg";

function node<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(ns, tag);
  for (const [name, value] of Object.entries(attributes))
    element.setAttribute(name, String(value));
  return element;
}

function inflate(box: Bounds, amount: number): Bounds {
  return {
    left: box.left - amount,
    top: box.top - amount,
    right: box.right + amount,
    bottom: box.bottom + amount,
  };
}

function overlap(box: Bounds, avoid: Bounds[]): number {
  return avoid.reduce(
    (sum, target) =>
      sum +
      Math.max(
        0,
        Math.min(box.right, target.right) - Math.max(box.left, target.left),
      ) *
        Math.max(
          0,
          Math.min(box.bottom, target.bottom) - Math.max(box.top, target.top),
        ),
    0,
  );
}

function measureText(section: HTMLElement): Bounds[] {
  const origin = section.getBoundingClientRect();
  const lines = section.querySelectorAll<HTMLElement>(".statement-line");
  const saved = Array.from(lines, (line) => line.style.transform);
  // Measure the unrotated copy, not its projected 3D bounds during a refresh.
  lines.forEach((line) => {
    line.style.transform = "none";
  });
  const result: Bounds[] = [];
  const range = document.createRange();
  for (const paragraph of section.querySelectorAll(".statement-text")) {
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (!text.textContent?.trim()) continue;
      range.selectNodeContents(text);
      for (const rect of range.getClientRects()) {
        if (rect.width < 1 || rect.height < 1) continue;
        const box = {
          left: rect.left - origin.left,
          top: rect.top - origin.top,
          right: rect.right - origin.left,
          bottom: rect.bottom - origin.top,
        };
        const existing = result.find(
          (line) =>
            Math.abs(line.top - box.top) < 2 &&
            Math.abs(line.bottom - box.bottom) < 2 &&
            box.left <= line.right + 20 &&
            box.right >= line.left - 20,
        );
        if (existing) {
          existing.left = Math.min(existing.left, box.left);
          existing.right = Math.max(existing.right, box.right);
        } else result.push(box);
      }
    }
  }
  lines.forEach((line, index) => {
    line.style.transform = saved[index];
  });
  return result;
}

function measureContour(element: SVGPathElement): MeasuredContour {
  const length = element.getTotalLength();
  const count = Math.max(64, Math.min(240, Math.round(length / 4)));
  const samples = Array.from({ length: count }, (_, index) => {
    const { x, y } = element.getPointAtLength((index / count) * length);
    return { x, y };
  });
  let topIndex = 0;
  samples.forEach((point, index) => {
    const best = samples[topIndex];
    if (
      point.y < best.y - 0.01 ||
      (Math.abs(point.y - best.y) <= 0.01 && point.x < best.x)
    )
      topIndex = index;
  });
  const xs = samples.map((point) => point.x);
  const ys = samples.map((point) => point.y);
  return {
    element,
    length,
    samples,
    from: (topIndex / count) * length,
    top: Math.min(...ys),
    bottom: Math.max(...ys),
    shortSide: Math.min(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
    ),
  };
}

function pencilPath(
  contour: MeasuredContour,
  seed: number,
  amplitude: number,
): string {
  let state = seed;
  const random = () => (state = (9301 * state + 49297) % 233280) / 233280;
  const frequency1 = 1.5 + 1.5 * random();
  const frequency2 = 4 + 3 * random();
  const phase1 = random() * Math.PI * 2;
  const phase2 = random() * Math.PI * 2;
  const steps = Math.max(24, Math.min(400, Math.round(contour.length / 5)));
  const wrap = (distance: number) =>
    ((distance % contour.length) + contour.length) % contour.length;
  let path = "";
  for (let index = 0; index <= steps; index++) {
    const progress = -0.02 + (0.97 * index) / steps;
    const distance = wrap(contour.from + progress * contour.length);
    const point = contour.element.getPointAtLength(distance);
    const next = contour.element.getPointAtLength(
      Math.min(contour.length, distance + 1.5),
    );
    const previous = contour.element.getPointAtLength(
      Math.max(0, distance - 1.5),
    );
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const tangent = Math.hypot(dx, dy) || 1;
    const wobble =
      amplitude *
      (0.65 * Math.sin(2 * Math.PI * frequency1 * progress + phase1) +
        0.35 * Math.sin(2 * Math.PI * frequency2 * progress + phase2));
    path += `${index ? "L" : "M"}${(point.x - (dy / tangent) * wobble).toFixed(1)} ${(point.y + (dx / tangent) * wobble).toFixed(1)}`;
  }
  return path;
}

export function createStatementDraft(section: HTMLElement) {
  const svg = section.querySelector<SVGSVGElement>(".statement-draft");
  if (!svg) throw new Error("Statement drawing surface is missing");
  let strokes: Stroke[] = [];
  let markers: Marker[] = [];
  let progress = 0;
  let disposed = false;
  const id = svg.dataset.draftId ?? "statement-draft";

  function render(value: number) {
    if (disposed) return;
    progress = value;
    for (const stroke of strokes) {
      const pose = strokePose(value, stroke);
      stroke.element.style.visibility = pose.visible ? "" : "hidden";
      if (pose.visible) {
        stroke.element.style.strokeDasharray = pose.dash;
        stroke.element.style.strokeDashoffset = String(pose.offset);
      }
    }
    for (const marker of markers) {
      const amount = windowProgress(value, [marker.at, marker.at + 0.04]);
      let scale =
        value < marker.at
          ? 0
          : 1 + 2.7 * (amount - 1) ** 3 + 1.7 * (amount - 1) ** 2;
      if (marker.retract)
        scale *=
          1 -
          windowProgress(value, [
            marker.retract[0],
            marker.retract[0] +
              Math.max(0.04, (marker.retract[1] - marker.retract[0]) * 0.5),
          ]);
      marker.element.style.visibility = scale <= 0.001 ? "hidden" : "";
      marker.element.setAttribute(
        "transform",
        `translate(${marker.point.x} ${marker.point.y}) scale(${Math.max(0, scale)})`,
      );
    }
  }

  function rebuild() {
    if (disposed || !svg) return;
    const width = section.clientWidth;
    const height = section.clientHeight;
    if (!width || !height) return;
    const text = measureText(section);
    const avoid = text.map((box) => inflate(box, 12));
    const maxScale = Math.min((height * 0.7) / 96, (width * 0.86) / 96);
    let placement = { scale: maxScale, x: 0, y: 0, cost: Infinity };
    for (const fraction of [1, 0.88, 0.76, 0.66, 0.56, 0.48]) {
      const scale = maxScale * fraction;
      for (const baseline of [0.88, 0.8, 0.94]) {
        const y = height * baseline - 102 * scale;
        const left = width * 0.05;
        const right = width * 0.95 - 96 * scale;
        for (let step = 0; step <= 12; step++) {
          const x = left + ((right - left) * step) / 12;
          const box = {
            left: Math.max(0, x),
            top: Math.max(0, y + 6 * scale),
            right: Math.min(width, x + 96 * scale),
            bottom: Math.min(height, y + 102 * scale),
          };
          const cost =
            (overlap(box, avoid) /
              Math.max(1, (box.right - box.left) * (box.bottom - box.top))) *
              0.7 +
            (1 - fraction) * 1.3 +
            Math.abs((width * 0.95 - x - 96 * scale) / width) * 0.35 +
            Math.abs(baseline - 0.88) * 0.6;
          if (cost < placement.cost) placement = { scale, x, y, cost };
        }
      }
    }
    const { scale, x, y } = placement;
    const project = (point: Point) => ({
      x: x + point.x * scale,
      y: y + point.y * scale,
    });
    const paths = formContours.map((contour) => contourPath(contour, project));
    const filled = width >= 900 && height >= 400;
    svg.dataset.weight = filled ? "fill" : "line";
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.replaceChildren();
    strokes = [];
    markers = [];

    const defs = node("defs");
    const mask = node("mask", {
      id: `${id}-mask`,
      maskUnits: "userSpaceOnUse",
      x: 0,
      y: 0,
      width,
      height,
    });
    const maskBase = node("rect", { width, height, fill: "white" });
    if (!filled) {
      const fade = Math.min(120, width * 0.12);
      const first = x - 20;
      const last = x + 96 * scale + 20;
      const gradient = node("linearGradient", {
        id: `${id}-fade`,
        gradientUnits: "userSpaceOnUse",
        x1: 0,
        y1: 0,
        x2: width,
        y2: 0,
      });
      let previous = 0;
      for (const [position, color] of [
        [first - fade, "black"],
        [first, "white"],
        [last, "white"],
        [last + fade, "black"],
      ] as const) {
        const offset = Math.max(
          previous,
          Math.max(0, Math.min(1, position / width)),
        );
        gradient.append(node("stop", { offset, "stop-color": color }));
        previous = offset;
      }
      defs.append(gradient);
      maskBase.style.fill = `url(#${id}-fade)`;
    }
    mask.append(maskBase);
    const filter = node("filter", {
      id: `${id}-blur`,
      x: "-25%",
      y: "-25%",
      width: "150%",
      height: "150%",
    });
    filter.append(node("feGaussianBlur", { stdDeviation: 12 }));
    const holes = node("g", { filter: `url(#${id}-blur)` });
    for (const box of text.map((box) => inflate(box, 24)))
      holes.append(
        node("rect", {
          x: box.left,
          y: box.top,
          width: box.right - box.left,
          height: box.bottom - box.top,
          rx: 6,
          fill: "black",
        }),
      );
    mask.append(holes);
    const clip = node("clipPath", { id: `${id}-clip` });
    clip.append(node("path", { d: paths.join(" "), "clip-rule": "evenodd" }));
    defs.append(filter, mask, clip);
    const masked = node("g", { mask: `url(#${id}-mask)` });
    const groups = {
      guides: node("g", { class: "draft-guides" }),
      construct: node("g", { class: "draft-construct" }),
      sketch: node("g", { class: "draft-sketch" }),
      ink: node("g", { class: "draft-ink", "clip-path": `url(#${id}-clip)` }),
      outline: node("g", { class: "draft-outline" }),
      handles: node("g", { class: "draft-handles" }),
      nodes: node("g", { class: "draft-nodes" }),
    };
    masked.append(groups.guides, groups.construct, groups.sketch);
    const details = node("g", { mask: `url(#${id}-mask)` });
    details.append(groups.outline, groups.handles, groups.nodes);
    svg.append(defs, masked, groups.ink, details);

    function addStroke(
      group: SVGGElement,
      d: string,
      draw: DrawWindow,
      retractWindow: DrawWindow | undefined = retract,
    ): SVGPathElement {
      const element = node("path", { d });
      group.append(element);
      strokes.push({
        element,
        kind: "open",
        length: element.getTotalLength(),
        from: 0,
        draw,
        retract: retractWindow,
      });
      return element;
    }
    for (const rule of [6, 102])
      addStroke(
        groups.guides,
        `M0 ${project({ x: 0, y: rule }).y}H${width}`,
        [0, 0.16],
      );
    for (const bearing of [0, 96])
      addStroke(
        groups.guides,
        `M${project({ x: bearing, y: 0 }).x} 0V${height}`,
        [0.03, 0.2],
      );
    const circleCenter = project({ x: 60, y: 42 });
    addStroke(
      groups.construct,
      `M0 ${project({ x: 0, y: 44 }).y}H${width}`,
      [0.14, 0.272],
    );
    addStroke(
      groups.construct,
      `M${project({ x: 58, y: 0 }).x} 0V${height}`,
      [0.194, 0.326],
    );
    addStroke(groups.construct, paths[1], [0.248, 0.38]);
    strokes.at(-1)!.kind = "loop";
    const cross = node("path", { d: "M-4 0H4M0 -4V4", class: "draft-cross" });
    groups.construct.append(cross);
    markers.push({ element: cross, point: circleCenter, at: 0.248, retract });

    const contours = paths.map((d) => {
      const path = node("path", { d });
      groups.outline.append(path);
      return measureContour(path);
    });
    const highest = Math.min(...contours.map((contour) => contour.top));
    const lowest = Math.max(...contours.map((contour) => contour.bottom));
    const shapeHeight = Math.max(1, lowest - highest);
    const staggerWindow = (
      window: DrawWindow,
      contour: MeasuredContour,
    ): DrawWindow => [
      window[0] +
        ((contour.top - highest) / shapeHeight) *
          (window[1] - window[0]) *
          0.45,
      window[1],
    ];
    const pointTiming = (point: Point, contour: MeasuredContour): number => {
      let nearest = 0;
      let distance = Infinity;
      contour.samples.forEach((sample, index) => {
        const score = (point.x - sample.x) ** 2 + (point.y - sample.y) ** 2;
        if (score < distance) {
          nearest = index;
          distance = score;
        }
      });
      const arc = Math.abs(
        (nearest / contour.samples.length) * contour.length - contour.from,
      );
      const amount = (2 * Math.min(arc, contour.length - arc)) / contour.length;
      const window = staggerWindow([0.3, 0.62], contour);
      return window[0] + amount * (window[1] - window[0]);
    };
    contours.forEach((contour, index) => {
      strokes.push({
        element: contour.element,
        kind: "loop",
        length: contour.length,
        from: contour.from,
        draw: staggerWindow([0.3, 0.62], contour),
        retract,
      });
      const amplitude = Math.min(
        Math.min(6, Math.max(1.5, 0.012 * Math.max(shapeHeight, 96 * scale))),
        Math.max(0.8, 0.012 * contour.length),
      );
      addStroke(
        groups.sketch,
        pencilPath(contour, 417 + index * 17.3, amplitude),
        staggerWindow([0.06, 0.3], contour),
      );
      if (filled) {
        const ink = node("path", {
          d: paths[index],
          "stroke-width": contour.shortSide * 1.04,
          "stroke-linecap": "butt",
        });
        ink.style.strokeWidth = String(contour.shortSide * 1.04);
        groups.ink.append(ink);
        strokes.push({
          element: ink,
          kind: "loop",
          length: contour.length,
          from: contour.from,
          draw: staggerWindow([0.48, 0.86], contour),
        });
      }
      const anchors: Point[] = [];
      for (const segment of formContours[index]) {
        const anchor = project(segment.start);
        if (
          !anchors.some(
            (point) =>
              Math.hypot(point.x - anchor.x, point.y - anchor.y) < 0.05,
          )
        )
          anchors.push(anchor);
        if (segment.kind !== "curve") continue;
        for (const [from, to] of [
          [segment.start, segment.control1],
          [segment.end, segment.control2],
        ]) {
          const a = project(from);
          const b = project(to);
          const at = pointTiming(a, contour) + 0.02;
          addStroke(groups.handles, `M${a.x} ${a.y}L${b.x} ${b.y}`, [
            at,
            at + 0.06,
          ]);
          const marker = node("circle", { r: 2.5, cx: 0, cy: 0 });
          groups.handles.append(marker);
          markers.push({ element: marker, point: b, at: at + 0.048, retract });
        }
      }
      for (const anchor of anchors) {
        const marker = node("rect", { x: -3.5, y: -3.5, width: 7, height: 7 });
        groups.nodes.append(marker);
        markers.push({
          element: marker,
          point: anchor,
          at: pointTiming(anchor, contour),
          retract,
        });
      }
    });
    render(progress);
    svg.dataset.ready = "true";
  }

  rebuild();
  return {
    render,
    rebuild,
    destroy() {
      disposed = true;
      strokes = [];
      markers = [];
      svg.replaceChildren();
      delete svg.dataset.ready;
    },
  };
}
