// Exercise 3, slow answer: every subset, keep those that add up to target, drop repeats with a Map.
// Correct, but O(2^n * n): it visits all 2^n subsets, even those far over the target.
import { subsetsByChoice } from "../shapes.ts";

export function vouchersForTotal(values: number[], target: number): number[][] {
  const found = new Map<string, number[]>();
  for (const s of subsetsByChoice(values.toSorted((a, b) => a - b)))
    if (s.reduce((sum, v) => sum + v, 0) === target) found.set(s.join(","), s);
  return [...found.values()];
}
