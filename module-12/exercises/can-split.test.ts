import { test } from "node:test";
import assert from "node:assert/strict";
import { canSplit } from "./can-split.ts";

// Every way to cut the line, by backtracking: correct, exponential.
function tryAllCuts(line: string, words: string[]): boolean {
  if (line === "") return true;
  return words.some((w) => line.startsWith(w) && tryAllCuts(line.slice(w.length), words));
}

const commands = ["git", "push", "pull", "origin", "main", "pu", "shor"];

test("lines that cut into known words", () => {
  assert.equal(canSplit("gitpushoriginmain", commands), true);
  assert.equal(canSplit("gitpullorigin", commands), true);
  assert.equal(canSplit("pushpushpush", commands), true); // a word used three times
});

test("a cut that looks right at first, and the one that works", () => {
  // "pu" + "shor" + ... fails on "igin", but "push" + "origin" works.
  assert.equal(canSplit("pushorigin", commands), true);
});

test("lines that don't cut", () => {
  assert.equal(canSplit("gitpus", commands), false);
  assert.equal(canSplit("gitx", commands), false);
  assert.equal(canSplit("main", []), false);
});

test("an empty line is no words", () => {
  assert.equal(canSplit("", commands), true);
  assert.equal(canSplit("", []), true);
});

test("matches trying every cut on 300 random lines", () => {
  for (let t = 0; t < 300; t++) {
    const piece = () => Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => "ab"[Math.floor(Math.random() * 2)]).join("");
    const words = Array.from({ length: Math.floor(Math.random() * 4) }, piece);
    const line = Array.from({ length: Math.floor(Math.random() * 14) }, () => "ab"[Math.floor(Math.random() * 2)]).join("");
    assert.equal(canSplit(line, words), tryAllCuts(line, words), JSON.stringify({ line, words }));
  }
});

test("100,000 characters in one long line (too deep for recursion)", () => {
  assert.equal(canSplit("ab".repeat(50_000), ["ab", "a"]), true);
});

test("a line that fails at its last character, in under 100 ms", () => {
  const line = "a".repeat(28) + "b";
  const start = performance.now();
  const got = canSplit(line, ["a", "aa", "aaa"]);
  const ms = performance.now() - start;
  assert.equal(got, false);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
