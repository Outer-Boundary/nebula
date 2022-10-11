export function getEnumValues(enumType: {}): string[] {
  return Object.keys(enumType).filter((x) => {
    return isNaN(Number(x));
  });
}

export function lerp(start: number, end: number, value: number): number {
  if (end < start) return -1;
  const diff = end - start;
  return diff * value + start;
}

export function clamp(min: number, max: number, value: number): number {
  return Math.min(Math.max(min, value), max);
}
