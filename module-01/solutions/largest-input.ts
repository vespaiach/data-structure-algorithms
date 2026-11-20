// Reading input limits: the largest n whose step count fits in a budget.
// steps(n) is how many basic steps an algorithm takes on an input of size n.
export const costs = {
  "n": (n: number) => n,
  "n log n": (n: number) => n * Math.log2(n),
  "n^2": (n: number) => n * n,
  "n^3": (n: number) => n * n * n,
  "2^n": (n: number) => 2 ** n,
};

// Double n until it no longer fits, then walk back up one by one from the last fit.
// O(log N + N/2) calls in the worst case, N = the answer; fine for a table of limits.
export function largestInput(steps: (n: number) => number, budget: number): number {
  let n = 1;
  if (steps(n) > budget) return 0;
  while (steps(n * 2) <= budget) n *= 2;
  while (steps(n + 1) <= budget) n++;
  return n;
}

// Print the table: node largest-input.ts
if (process.argv[1] === import.meta.filename) {
  for (const [name, steps] of Object.entries(costs)) {
    console.log(name.padEnd(8), largestInput(steps, 1e8).toLocaleString("en-US"));
  }
}
