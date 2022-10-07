export function getEnumValues(enumType: {}): string[] {
  return Object.keys(enumType).filter((x) => {
    return isNaN(Number(x));
  });
}
