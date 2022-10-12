// gets the values of an enum
export function getEnumValues(enumType: {}): string[] {
  return Object.keys(enumType).filter((x) => {
    return isNaN(Number(x));
  });
}

// lerps a value linearly interpolated between start and end. if end is lesser than start, it returns -1
export function lerp(start: number, end: number, value: number): number {
  if (end < start) return -1;
  const diff = end - start;
  return diff * value + start;
}

// clamps a value between min and max. if min is greater than max, min is the new max and vice versa
export function clamp(min: number, max: number, value: number): number {
  return Math.min(Math.max(min < max ? min : max, value), max > min ? max : min);
}
