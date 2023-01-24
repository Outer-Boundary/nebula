// gets the values of an enum
export function getEnumValues(enumType: {} | undefined): string[] {
  if (!enumType) return [];
  return Object.keys(enumType).filter((x) => isNaN(Number(x)));
}

// lerps a value linearly interpolated between start and end. if end is less than start, it returns NaN
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
    .replace(/[^A-Za-z ]|[_]/g, "")
    .replace(/ /g, "-");
}

/**
 * Returns a random number between 0 and 1 inclusive. From: https://stackoverflow.com/questions/2143723/write-a-truly-inclusive-random-method-for-javascript
 */
export function inclusiveRandom() {
  if (Math.random() === 0) return 1;
  return Math.random();
}

/**
 * Returns a random number between the min and max value (inclusive)
 */
export function getRandomValueBetween(min: number, max: number) {
  return min + inclusiveRandom() * (max - min);
}

/**
 * Returns a random whole number between the min and max value (inclusive)
 */
export function getRandomWholeValueBetween(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export const backgroundColours = [
  "rgb(20, 0, 186)",
  "rgb(3, 2, 80)",
  "rgb(201, 7, 103)",
  "rgb(137, 57, 172)",
  "rgb(234, 85, 87)",
  "rgb(255, 203, 99)",
];

export function getGradientBackground(colours: string[], minNumGradients: number, maxNumGradients: number) {
  const numGradients = getRandomWholeValueBetween(minNumGradients, maxNumGradients);
  let backgrounds: string[] = [];
  for (let i = 0; i < numGradients; i++) {
    const shape = Math.random() <= 0.5 ? "circle" : "ellipse";

    const posX = getRandomValueBetween(0, 100);
    const posY = getRandomValueBetween(0, 100);

    const transparentSpread = getRandomValueBetween(25, 50);
    const colourSpread = getRandomValueBetween(0, transparentSpread - 25);

    const colour = colours[getRandomWholeValueBetween(0, colours.length - 1)];
    const colour2 = colours[getRandomWholeValueBetween(0, colours.length - 1)];

    backgrounds.push(`radial-gradient(${shape} at ${posX}% ${posY}%, ${colour} ${colourSpread}%, ${colour2} ${transparentSpread}%)`);
  }
  return backgrounds.join(",");
}
