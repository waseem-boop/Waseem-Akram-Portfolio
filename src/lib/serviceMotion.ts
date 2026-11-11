export const serviceMotion = {
  breakpoint: 700,
  dwell: 600,
  screenInterval: 1400,
  screenFade: 700,
  liftDuration: 600,
  dockDuration: 900,
  width: 320,
  height: 400,
  cursorOffset: 190,
} as const;

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function lerpFactor(factor: number, frames: number) {
  return 1 - Math.pow(1 - factor, frames);
}

export function easeOut(value: number) {
  const progress = clamp(value);
  if (progress === 0 || progress === 1) return progress;
  // Invert the time axis of the reference's cubic-bezier(.16, 1, .3, 1).
  let low = 0;
  let high = 1;
  for (let index = 0; index < 18; index++) {
    const t = (low + high) / 2;
    const x = 3 * (1 - t) ** 2 * t * 0.16 + 3 * (1 - t) * t * t * 0.3 + t ** 3;
    if (x < progress) low = t;
    else high = t;
  }
  return 1 - (1 - (low + high) / 2) ** 3;
}

export function rowTypography(progress: number) {
  const value = clamp(progress);
  return {
    width: 88 + 30 * value,
    weight: 700 - 300 * value,
    opacity: 0.5 + 0.5 * value,
  };
}

export type ServiceRowBounds = {
  top: number;
  center: number;
  nameTop: number;
  nameBottom: number;
};

export function closestRow(
  rows: ServiceRowBounds[],
  scroll: number,
  height: number,
  mobileTop?: number,
) {
  let index = 0;
  let bestDistance = Infinity;
  let bestVisibility = -1;
  rows.forEach((row, current) => {
    if (mobileTop !== undefined) {
      const top = scroll + mobileTop;
      const bottom = scroll + height;
      const visible =
        Math.max(
          0,
          Math.min(row.nameBottom, bottom) - Math.max(row.nameTop, top),
        ) / Math.max(1, row.nameBottom - row.nameTop);
      const distance = Math.abs(
        (row.nameTop + row.nameBottom) / 2 - (top + bottom) / 2,
      );
      if (
        visible > bestVisibility + 0.01 ||
        (visible >= bestVisibility - 0.01 && distance < bestDistance)
      ) {
        bestVisibility = Math.max(visible, bestVisibility);
        bestDistance = distance;
        index = current;
      }
    } else {
      const distance = Math.abs(row.center - (scroll + height / 2));
      if (distance < bestDistance) {
        bestDistance = distance;
        index = current;
      }
    }
  });
  return index;
}
