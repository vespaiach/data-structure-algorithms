// Reading input limits: the largest n whose step count fits in a budget.
// steps(n) is how many basic steps an algorithm takes on an input of size n.
export const costs = {
  "n": (n: number) => n,
  "n log n": (n: number) => n * Math.log2(n),
  "n^2": (n: number) => n * n,
  "n^3": (n: number) => n * n * n,
  "2^n": (n: number) => 2 ** n,
};

export function largestInput(steps: (n: number) => number, budget: number): number {
  throw new Error("not implemented");
}
