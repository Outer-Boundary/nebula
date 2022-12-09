export const toTitleCase = (str: string): string => {
  return str
    .split(" ")
    .map((s) => s.substring(0, 1).toUpperCase() + s.substring(1))
    .join(" ");
};
