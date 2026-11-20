import { test } from "node:test";
import assert from "node:assert/strict";
import { deployOrders } from "./deploy-orders.ts";

const key = (xs: string[][]) => xs.map((o) => o.join(">")).sort().join(" ");

// Every order, then keep the ones that follow every rule: correct but slow.
function bruteForce(steps: string[], rules: [string, string][]): string[][] {
  const all: string[][] = [];
  const perm = (rest: string[], path: string[]): void => {
    if (rest.length === 0) all.push(path);
    rest.forEach((s, i) => perm(rest.toSpliced(i, 1), [...path, s]));
  };
  perm(steps, []);
  return all.filter((o) => rules.every(([a, b]) => o.indexOf(a) < o.indexOf(b)));
}

test("four steps and two rules", () => {
  const out = deployOrders(["build", "migrate", "deploy", "notify"], [["build", "deploy"], ["migrate", "deploy"]]);
  assert.equal(key(out), key([
    ["build", "migrate", "deploy", "notify"], ["build", "migrate", "notify", "deploy"],
    ["build", "notify", "migrate", "deploy"], ["migrate", "build", "deploy", "notify"],
    ["migrate", "build", "notify", "deploy"], ["migrate", "notify", "build", "deploy"],
    ["notify", "build", "migrate", "deploy"], ["notify", "migrate", "build", "deploy"],
  ]));
});

test("no rules: every order; no steps: one empty order", () => {
  assert.equal(deployOrders(["a", "b", "c", "d"], []).length, 24);
  assert.deepEqual(deployOrders([], []), [[]]);
});

test("rules that form a cycle: no order works", () => {
  assert.deepEqual(deployOrders(["a", "b", "c"], [["a", "b"], ["b", "c"], ["c", "a"]]), []);
});

test("matches a brute force on 200 random cases", () => {
  for (let t = 0; t < 200; t++) {
    const steps = Array.from({ length: Math.floor(Math.random() * 7) }, (_, i) => `s${i}`);
    const rules: [string, string][] = [];
    for (let r = Math.floor(Math.random() * 6); r > 0 && steps.length > 1; r--) {
      const a = Math.floor(Math.random() * steps.length), b = Math.floor(Math.random() * steps.length);
      if (a !== b) rules.push([steps[a], steps[b]]);
    }
    assert.equal(key(deployOrders(steps, rules)), key(bruteForce(steps, rules)), JSON.stringify({ steps, rules }));
  }
});

test("10 steps in two chains of 5, in under 100 ms", () => {
  const steps = Array.from({ length: 10 }, (_, i) => `s${i}`);
  const rules: [string, string][] = [];
  for (let i = 0; i < 4; i++) rules.push([`s${i}`, `s${i + 1}`], [`s${i + 5}`, `s${i + 6}`]);
  const start = performance.now();
  const out = deployOrders(steps.toReversed(), rules);
  const ms = performance.now() - start;
  assert.equal(out.length, 252); // choose which 5 of the 10 places the first chain takes
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
