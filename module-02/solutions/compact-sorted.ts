// Remove repeated IDs from a sorted array in place; return how many unique IDs remain.
// `write` marks the end of the unique part; `read` runs ahead over every item.
// O(n) time, O(1) extra memory.
export function compactSorted(ids: number[]): number {
  if (ids.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < ids.length; read++) {
    if (ids[read] !== ids[write - 1]) {
      ids[write] = ids[read];
      write++;
    }
  }
  ids.length = write;
  return write;
}
