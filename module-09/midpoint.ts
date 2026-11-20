// The midpoint bug from Java and C (Bloch, 2006), and what it becomes in JavaScript: node midpoint.ts

// 1. Plain addition is exact for every integer below 2^53, so this is safe
// for any array index and for most "binary search on the answer" ranges.
const lo = 3_000_000_000, hi = 4_000_000_000;
console.log("1. Math.floor((lo + hi) / 2):", Math.floor((lo + hi) / 2));

// 2. The Java fix (lo + hi) >>> 1 is a bug in JavaScript: >>> first turns
// its left side into a 32-bit unsigned integer, so a sum of 2^32 or more wraps.
console.log("2. (lo + hi) >>> 1:", (lo + hi) >>> 1, "  (lo + hi) >> 1:", (lo + hi) >> 1, "  ((lo + hi) / 2) | 0:", ((lo + hi) / 2) | 0);

// 3. A search on the answer with that midpoint: smallest x with x * x >= 10^19.
function sqrtCeil(target: number, mid: (lo: number, hi: number) => number): string {
  let a = 0, b = 2 ** 33; // the answer lies in [0, 2^33]
  for (let steps = 0; a < b; steps++) {
    if (steps > 200) return `gave up after 200 steps, lo=${a} hi=${b}`;
    const m = mid(a, b);
    if (m * m >= target) b = m;
    else a = m + 1;
  }
  return String(a);
}
console.log("3. with Math.floor:", sqrtCeil(1e19, (a, b) => a + Math.floor((b - a) / 2)));
console.log("   with >>> 1:   ", sqrtCeil(1e19, (a, b) => (a + b) >>> 1));

// 4. Above 2^53, Numbers skip integers: lo + 1 can equal lo.
const big = 2 ** 53;
console.log("4. 2^53 + 1 === 2^53:", big + 1 === big, "  Number.MAX_SAFE_INTEGER:", Number.MAX_SAFE_INTEGER);
