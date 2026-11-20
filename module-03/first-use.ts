// The first time a string is used as a Map or Set key costs more than later uses.
import { bench } from "./bench.ts";

const sizes = [100_000, 1_000_000];
// Fresh 10-character IDs, never used as keys before: the case in firstDuplicate.
const freshIds = (n: number): string[] => Array.from({ length: n }, () => Math.random().toString(36).slice(2, 12));
// The same kind of IDs, already used once as Set keys while building the input.
const usedIds = (n: number): string[] => {
  const ids = freshIds(n);
  new Set(ids);
  return ids;
};
const numbers = (n: number): number[] => Array.from({ length: n }, (_, i) => i * 7);

bench("new Set of fresh string IDs", sizes, freshIds, (ids) => new Set(ids).size);
bench("new Set of string IDs used as keys before", sizes, usedIds, (ids) => new Set(ids).size);
bench("new Set of small integers", sizes, numbers, (ns) => new Set(ns).size);
