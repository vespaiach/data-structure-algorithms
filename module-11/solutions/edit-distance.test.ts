import { test } from "node:test";
import assert from "node:assert/strict";
import { editDistance } from "./edit-distance.ts";

// Breadth-first search over strings: every string one edit away, until b turns up. Correct, but
// only for short strings over a small alphabet.
function bruteForce(a: string, b: string): number {
  const letters = [...new Set(a + b)];
  let level = new Set([a]);
  const seen = new Set([a]);
  for (let steps = 0; ; steps++) {
    if (level.has(b)) return steps;
    const next = new Set<string>();
    for (const s of level)
      for (let i = 0; i <= s.length; i++) {
        const options = [s.slice(0, i) + s.slice(i + 1)]; // delete s[i]
        for (const ch of letters) options.push(s.slice(0, i) + ch + s.slice(i), s.slice(0, i) + ch + s.slice(i + 1));
        for (const o of options) if (o.length <= Math.max(a.length, b.length) && !seen.has(o)) (seen.add(o), next.add(o));
      }
    level = next;
  }
}

test("one edit", () => {
  assert.equal(editDistance("colour", "color"), 1); // delete u
  assert.equal(editDistance("cart", "chart"), 1); // insert h
  assert.equal(editDistance("cart", "card"), 1); // replace t
});

test("several edits", () => {
  assert.equal(editDistance("sunday", "saturday"), 3);
  assert.equal(editDistance("deploy", "replay"), 2); // d -> r, o -> a
  assert.equal(editDistance("abc", "xyz"), 3);
});

test("empty strings and equal strings", () => {
  assert.equal(editDistance("", "abc"), 3);
  assert.equal(editDistance("abc", ""), 3);
  assert.equal(editDistance("", ""), 0);
  assert.equal(editDistance("same", "same"), 0);
});

test("the same in both directions", () => {
  assert.equal(editDistance("kitchen", "sitting"), editDistance("sitting", "kitchen"));
});

test("matches a brute force on 200 random pairs", () => {
  const word = () => Array.from({ length: Math.floor(Math.random() * 5) }, () => "ab"[Math.floor(Math.random() * 2)]).join("");
  for (let t = 0; t < 200; t++) {
    const a = word(), b = word();
    assert.equal(editDistance(a, b), bruteForce(a, b), `${a} ${b}`);
  }
});

test("a long string against a short one", () => {
  assert.equal(editDistance("a".repeat(200_000), "ab"), 199_999);
  assert.equal(editDistance("ab", "a".repeat(200_000)), 199_999);
});

test("1,000,000 letters against 30 in under 1,000 ms", () => {
  const start = performance.now();
  const got = editDistance("ab".repeat(500_000), "ba".repeat(15));
  const ms = performance.now() - start;
  assert.equal(got, 999_970);
  assert.ok(ms < 1000, `took ${Math.round(ms)} ms`);
});

test("two 12-letter strings in under 100 ms", () => {
  const start = performance.now();
  const got = editDistance("abcdefghijkl", "mnopqrstuvwx");
  const ms = performance.now() - start;
  assert.equal(got, 12);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
