// https://stackoverflow.com/a/66512466/9449426
export const setDifference = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const result = new Set<T>();

  for (const item of a) {
    if (!b.has(item)) {
      result.add(item);
    }
  }

  return result;
};

// typescript should have this built-in, what a shame
// ~Copilot - 2023
export const keyOf = <T extends object>(obj: T) => {
  return Object.keys(obj) as any as (keyof T)[];
};
