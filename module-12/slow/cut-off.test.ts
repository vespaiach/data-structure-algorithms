import { test } from "node:test";
import assert from "node:assert/strict";
import { cutOff } from "./cut-off.ts";

// A walk forward from every service: correct, O(V * (V + E)).
function walkFromEach(services: string[], calls: [string, string][], target: string): string[] {
  return services.filter((start) => {
    const seen = new Set([start]);
    const stack = [start];
    while (stack.length > 0) {
      const s = stack.pop()!;
      if (s === target) return false;
      for (const [from, to] of calls) if (from === s && !seen.has(to)) (seen.add(to), stack.push(to));
    }
    return true;
  });
}

const services = ["web", "api", "auth", "billing", "db", "mailer", "reports"];
const calls: [string, string][] = [
  ["web", "api"], ["api", "auth"], ["api", "billing"], ["billing", "db"],
  ["auth", "api"], ["mailer", "web"], ["reports", "mailer"], ["reports", "reports"],
];

test("a small system", () => {
  // api reaches db through billing, auth through api, mailer and reports through web.
  assert.deepEqual(cutOff(services, calls, "db"), []);
  assert.deepEqual(cutOff(services, calls, "auth"), ["billing", "db"]);
  assert.deepEqual(cutOff(services, calls, "reports"), ["web", "api", "auth", "billing", "db", "mailer"]);
});

test("loops, a service that calls itself, and calls listed twice", () => {
  assert.deepEqual(cutOff(["a", "b", "c"], [["a", "b"], ["b", "a"], ["c", "c"], ["a", "b"]], "b"), ["c"]);
});

test("no calls at all: only the target reaches the target", () => {
  assert.deepEqual(cutOff(["x", "y", "z"], [], "y"), ["x", "z"]);
  assert.deepEqual(cutOff(["y"], [], "y"), []);
});

test("matches a walk from every service on 300 random systems", () => {
  for (let t = 0; t < 300; t++) {
    const n = 1 + Math.floor(Math.random() * 12);
    const names = Array.from({ length: n }, (_, i) => `s${i}`);
    const pick = () => names[Math.floor(Math.random() * n)];
    const cs: [string, string][] = Array.from({ length: Math.floor(Math.random() * 2 * n) }, () => [pick(), pick()]);
    const target = pick();
    assert.deepEqual(cutOff(names, cs, target), walkFromEach(names, cs, target), JSON.stringify({ cs, target }));
  }
});

test("a chain of 5,000 services and 15,000 calls in under 100 ms", () => {
  // s0 calls s1, s1 calls s2, ..., and every service also calls two random ones before it.
  const n = 5_000;
  const names = Array.from({ length: n }, (_, i) => `s${i}`);
  const cs: [string, string][] = [];
  for (let i = 0; i < n - 1; i++) cs.push([names[i], names[i + 1]]);
  for (let i = 1; i < n; i++) for (let k = 0; k < 2; k++) cs.push([names[i], names[Math.floor(Math.random() * i)]]);
  const start = performance.now();
  const got = cutOff(names, cs, names[n - 1]);
  const ms = performance.now() - start;
  assert.deepEqual(got, []);
  assert.deepEqual(cutOff(names, cs, names[0]), []); // every service calls back down to s0
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
