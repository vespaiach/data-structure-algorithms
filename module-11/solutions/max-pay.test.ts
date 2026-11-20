import { test } from "node:test";
import assert from "node:assert/strict";
import { maxPay } from "./max-pay.ts";

// Every set of shifts with no two in a row, the best total: correct but O(2^n * n).
function bruteForce(pays: number[]): number {
  let best = 0;
  for (let mask = 0; mask < 2 ** pays.length; mask++) {
    let total = 0, ok = true;
    for (let i = 0; i < pays.length; i++) {
      if (Math.floor(mask / 2 ** i) % 2 === 0) continue;
      if (i > 0 && Math.floor(mask / 2 ** (i - 1)) % 2 === 1) ok = false;
      total += pays[i];
    }
    if (ok) best = Math.max(best, total);
  }
  return best;
}

test("shifts that are not next to each other", () => {
  assert.equal(maxPay([100, 200, 300, 100]), 400); // shifts 0 and 2
  assert.equal(maxPay([200, 70, 30, 220]), 420); // shifts 0 and 3
});

test("taking the biggest pay first is wrong here", () => {
  assert.equal(maxPay([90, 100, 90]), 180);
});

test("no shifts, one shift, two shifts", () => {
  assert.equal(maxPay([]), 0);
  assert.equal(maxPay([50]), 50);
  assert.equal(maxPay([50, 60]), 60);
});

test("matches a brute force on 200 random cases", () => {
  for (let t = 0; t < 200; t++) {
    const pays = Array.from({ length: Math.floor(Math.random() * 13) }, () => 1 + Math.floor(Math.random() * 100));
    assert.equal(maxPay(pays), bruteForce(pays), JSON.stringify(pays));
  }
});

test("100,000 shifts (too deep for recursion)", () => {
  const pays = Array.from({ length: 100_000 }, (_, i) => (i % 2 === 0 ? 10 : 1));
  assert.equal(maxPay(pays), 500_000);
});

test("38 shifts in under 100 ms", () => {
  const pays = Array.from({ length: 38 }, () => 1 + Math.floor(Math.random() * 100));
  const start = performance.now();
  const got = maxPay(pays);
  const ms = performance.now() - start;
  let before = 0, last = 0; // the answer, computed the reading's way
  for (const p of pays) [before, last] = [last, Math.max(last, before + p)];
  assert.equal(got, last);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
