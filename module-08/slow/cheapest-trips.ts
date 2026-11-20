// A correct but slow answer to Exercise 4: price every pair, sort them all, keep k.
// O(n * m * log(n * m)) time, O(n * m) memory.
export function cheapestTrips(out: number[], back: number[], k: number): number[] {
  const prices: number[] = [];
  for (const a of out) for (const b of back) prices.push(a + b);
  return prices.sort((x, y) => x - y).slice(0, k);
}
