// Measure the nested scan against the Set version: node solutions/measure-has-common.ts
import { bench } from "../bench.ts";
import { hasCommon } from "./has-common.ts";

// The first version most people write: O(a x b) string comparisons.
function hasCommonSlow(a: string[], b: string[]): boolean {
  return b.some((email) => a.includes(email));
}

// Two lists with no shared address, so both versions do all their work.
// padStart gives every address the same length, so every comparison reads the characters.
const lists = (n: number): [string[], string[]] => [
  Array.from({ length: n }, (_, i) => `user${String(i).padStart(6, "0")}@a.io`),
  Array.from({ length: n }, (_, i) => `user${String(i).padStart(6, "0")}@b.io`),
];

const sizes = [2_000, 4_000, 8_000];
bench("hasCommonSlow", sizes, lists, ([a, b]) => hasCommonSlow(a, b));
bench("hasCommon with a Set", sizes, lists, ([a, b]) => hasCommon(a, b));
