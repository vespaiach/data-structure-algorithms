// Stretch: problem C's row of reachable totals as the bits of one BigInt: node bitset-bench.ts
// Bit t of `reach` is 1 when some group adds up to t; adding a cost c is reach | (reach << c).
import assert from "node:assert/strict";
import { bench } from "./bench.ts";
import { hasGroupWithTotal } from "./opening.ts";

// The same O(n * S) bits of work as the array, for S = the sum of the costs, and O(S) bits of memory,
// but one shift and one OR per cost instead of a loop over the totals.
export function hasGroupBits(costs: number[], total: number): boolean {
  if (total < 0) return false;
  let reach = 1n; // only the total 0
  for (const c of costs) reach |= reach << BigInt(c);
  return ((reach >> BigInt(total)) & 1n) === 1n;
}

// n costs from 1 to 100, and a total no group reaches when every cost is even: so the
// costs are even, the total odd, and both versions fill their whole row.
function makeCosts(n: number): { costs: number[]; total: number } {
  const costs = Array.from({ length: n }, () => 2 * (1 + Math.floor(Math.random() * 50)));
  const sum = costs.reduce((s, c) => s + c, 0);
  return { costs, total: 2 * Math.floor(sum / 4) + 1 };
}

let sink = 0;

if (process.argv[1] === import.meta.filename) {
  for (let t = 0; t < 500; t++) {
    const costs = Array.from({ length: Math.floor(Math.random() * 15) }, () => 1 + Math.floor(Math.random() * 30));
    const total = Math.floor(Math.random() * 200);
    assert.equal(hasGroupBits(costs, total), hasGroupWithTotal(costs, total));
  }
  console.log("hasGroupBits and hasGroupWithTotal agree on 500 random lists: true");

  const sizes = [200, 400, 800];
  bench("array of booleans", sizes, makeCosts, ({ costs, total }) => (sink += +hasGroupWithTotal(costs, total)));
  bench("BigInt bitset", sizes, makeCosts, ({ costs, total }) => (sink += +hasGroupBits(costs, total)));
  if (sink !== 0) console.log(sink);
}
