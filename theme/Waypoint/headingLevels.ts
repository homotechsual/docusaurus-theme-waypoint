export function resolveHeadingLevels(value: unknown, defaults: number[], permalink: string): number[] {
  if (value === undefined) {
    return defaults;
  }
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((level) => Number.isInteger(level) && level >= 2 && level <= 6)
  ) {
    throw new Error(
      `Invalid waypointHeadingLevels in ${permalink}: expected a non-empty array of heading levels from 2 to 6.`,
    );
  }
  return value;
}
