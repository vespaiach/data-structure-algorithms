import { test } from "node:test";
import assert from "node:assert/strict";
import { hasPairWithTotal, hasRunWithTotal, hasGroupWithTotal } from "./opening.ts";

const xs = [8, 3, 5, 9, 1];

// Brute forces: every pair, every run, every group. Correct but slow.
const pairBrute = (a: number[], t: number) => a.some((x, i) => a.some((y, j) => i < j && x + y === t));
function runBrute(a: number[], t: number): boolean {
  for (let i = 0; i < a.length; i++) {
    let sum = 0;
    for (let j = i; j < a.length; j++) if ((sum += a[j]) === t) return true;
  }
  return false;
}
function groupBrute(a: number[], t: number): boolean {
  for (let mask = 0; mask < 2 ** a.length; mask++) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) if (Math.floor(mask / 2 ** i) % 2 === 1) sum += a[i];
    if (sum === t) return true;
  }
  return false;
}
const randomList = () => Array.from({ length: Math.floor(Math.random() * 11) }, () => 1 + Math.floor(Math.random() * 20));

test("the three answers differ on the same list", () => {
  const all = (t: number) => [hasPairWithTotal(xs, t), hasRunWithTotal(xs, t), hasGroupWithTotal(xs, t)];
  assert.deepEqual(all(12), [true, false, true]); // 3 + 9: a pair, not next to each other
  assert.deepEqual(all(16), [false, true, true]); // 8 + 3 + 5: a run
  assert.deepEqual(all(22), [false, false, true]); // 8 + 5 + 9: only a group
});

test("pair: two different positions", () => {
  assert.equal(hasPairWithTotal([8], 16), false); // 8 + 8 would use one price twice
  assert.equal(hasPairWithTotal([8, 8], 16), true);
  assert.equal(hasPairWithTotal([], 0), false);
});

test("run: consecutive only, never empty", () => {
  assert.equal(hasRunWithTotal(xs, 26), true); // the whole list
  assert.equal(hasRunWithTotal(xs, 0), false); // only the empty run adds up to 0
  assert.equal(hasRunWithTotal([], 5), false);
});

test("group: the empty group, too large, negative", () => {
  assert.equal(hasGroupWithTotal(xs, 0), true);
  assert.equal(hasGroupWithTotal(xs, 27), false); // the whole list is 26
  assert.equal(hasGroupWithTotal(xs, -1), false);
});

test("all three match a brute force on 500 random lists", () => {
  for (let trial = 0; trial < 500; trial++) {
    const a = randomList();
    const t = Math.floor(Math.random() * 60);
    const msg = `${JSON.stringify(a)}, ${t}`;
    assert.equal(hasPairWithTotal(a, t), pairBrute(a, t), msg);
    assert.equal(hasRunWithTotal(a, t), runBrute(a, t), msg);
    assert.equal(hasGroupWithTotal(a, t), groupBrute(a, t), msg);
  }
});
