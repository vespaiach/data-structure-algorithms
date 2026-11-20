// A correct but slow answer to Exercise 1: sort the remaining files again before every merge.
// The array is almost sorted each time, so each sort is about O(n): O(n^2) in all.
export function mergeCost(sizes: number[]): number {
  const files = sizes.slice();
  let total = 0;
  while (files.length > 1) {
    files.sort((a, b) => b - a); // smallest at the end
    const merged = files.pop()! + files.pop()!;
    total += merged;
    files.push(merged);
  }
  return total;
}
