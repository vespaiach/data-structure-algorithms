// Research only: checks the old seeded shuffle in bst.ts against a Math.random() shuffle.
// node shuffle-check.ts
import { build, height } from "./bst.ts";

// The research's original shuffle: a float LCG (loses precision past 2^53) and seed % (i + 1) (low bits).
function oldShuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  let seed = 42;
  let inexact = 0;
  for (let i = n - 1; i > 0; i--) {
    const product = seed * 1103515245 + 12345;
    if (product > Number.MAX_SAFE_INTEGER) inexact++;
    seed = product % 2147483648;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  console.log(`  old: ${inexact} of ${n - 1} LCG steps exceeded 2^53`);
  return a;
}

function randomShuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A uniform permutation moves about n - 1 items and has about n / 2 ascents.
function describe(label: string, a: number[]): void {
  const distinct = new Set(a).size;
  let fixed = 0, ascents = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === i) fixed++;
    if (i > 0 && a[i] > a[i - 1]) ascents++;
  }
  console.log(`  ${label}: n ${a.length}, distinct ${distinct}, fixed points ${fixed}, ascents ${ascents}, BST height ${height(build(a))}`);
}

for (const n of [1_000, 10_000, 100_000]) {
  console.log(`n = ${n}`);
  describe("old seeded shuffle", oldShuffled(n));
  for (let r = 0; r < 3; r++) describe(`Math.random shuffle ${r + 1}`, randomShuffled(n));
}
