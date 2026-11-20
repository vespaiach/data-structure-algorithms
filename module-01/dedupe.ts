// Two correct ways to remove duplicates from a list, keeping the first copy of each value.

// For each item, scan everything kept so far: O(n * k) time, k = distinct values; O(n^2) when all differ.
export function dedupeSlow<T>(items: T[]): T[] {
  const kept: T[] = [];
  for (const item of items) {
    if (!kept.includes(item)) kept.push(item);
  }
  return kept;
}

// A Set answers "seen before?" in O(1) on average: O(n) time, O(k) extra memory.
export function dedupeFast<T>(items: T[]): T[] {
  return [...new Set(items)];
}
