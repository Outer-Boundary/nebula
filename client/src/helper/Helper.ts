// gets the values of an enum
export function getEnumValues(enumType: {} | undefined): string[] {
  if (!enumType) return [];
  return Object.keys(enumType).filter((x) => {
    return isNaN(Number(x));
  });
}

// lerps a value linearly interpolated between start and end. if end is lesser than start, it returns NaN
export function lerp(start: number, end: number, value: number): number {
  if (end < start) return NaN;
  const diff = end - start;
  return diff * value + start;
}

// clamps a value between min and max. if min is greater than max, min is the new max and vice versa
export function clamp(min: number, max: number, value: number): number {
  return Math.min(Math.max(min < max ? min : max, value), max > min ? max : min);
}

// returns a string in kebab style and removes any special characters or numbers. e.g changes 'Hello World' to 'hello-world'
export function getKebabStyledString(str: string) {
  return str
    .toLowerCase()
    .replace(/[^A-z ]|[_]/g, "")
    .replace(/ /g, "-");
}

export function getTitleCaseStyledString(str: string) {
  let newStr = str.substring(0, 1).toUpperCase();
  for (let i = 1; i < str.length; i++) {
    let letter = str[i];
    if (str[i - 1] === " " || str[i - 1] === "-") {
      letter = letter.toUpperCase();
    }
    newStr += letter;
  }
  return newStr;
}
