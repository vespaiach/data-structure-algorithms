import { test } from "node:test";
import assert from "node:assert/strict";
import { gridHasCode } from "./grid-code.ts";

const grid = ["CATS", "ODEX", "PINE"];

// The 8 turns and mirror images of a grid of letters.
function variants(g: string[]): string[][] {
  const turn = (h: string[]) => Array.from(h[0], (_, c) => h.map((row) => row[c]).reverse().join(""));
  const mirror = (h: string[]) => h.map((row) => [...row].reverse().join(""));
  const out: string[][] = [];
  let cur = g;
  for (let i = 0; i < 4; i++) {
    out.push(cur, mirror(cur));
    cur = turn(cur);
  }
  return out;
}

// Every path of length L from every cell, compared at the end: correct but slow.
function bruteForce(g: string[], code: string): boolean {
  if (code.length === 0) return true;
  const rows = g.length, cols = rows ? g[0].length : 0;
  const used = new Set<number>();
  const walk = (r: number, c: number, word: string): boolean => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || used.has(r * cols + c)) return false;
    word += g[r][c];
    if (word.length === code.length) return word === code;
    used.add(r * cols + c);
    const found = walk(r + 1, c, word) || walk(r - 1, c, word) || walk(r, c + 1, word) || walk(r, c - 1, word);
    used.delete(r * cols + c);
    return found;
  };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (walk(r, c, "")) return true;
  return false;
}

test("finds codes that turn corners", () => {
  assert.equal(gridHasCode(grid, "CAT"), true);
  assert.equal(gridHasCode(grid, "COPI"), true);
  assert.equal(gridHasCode(grid, "SXEN"), true);
  assert.equal(gridHasCode(grid, "CATSXENIPODE"), true);
});

test("rejects a code that needs a cell twice, a diagonal move, or a missing letter", () => {
  assert.equal(gridHasCode(["AB", "CD"], "ABA"), false);
  assert.equal(gridHasCode(grid, "CD"), false);
  assert.equal(gridHasCode(grid, "CAZ"), false);
});

test("empty code, empty grid, code longer than the grid", () => {
  assert.equal(gridHasCode(grid, ""), true);
  assert.equal(gridHasCode([], "A"), false);
  assert.equal(gridHasCode(["AB"], "ABA"), false);
});

test("a dead end must not block a later path, in every turn of the grid", () => {
  for (const g of variants(["AAB", "AAC", "AAA"])) assert.equal(gridHasCode(g, "AAAAAAC"), true, g.join("/"));
  for (const g of variants(["AAAA", "ABBA", "AAAC"])) assert.equal(gridHasCode(g, "AAAAAAAC"), true, g.join("/"));
});

test("the grid can be searched again", () => {
  assert.equal(gridHasCode(grid, "DEN"), true);
  assert.equal(gridHasCode(grid, "DEN"), true);
});

test("matches a brute force on 300 random small grids", () => {
  for (let t = 0; t < 300; t++) {
    const rows = 1 + Math.floor(Math.random() * 3), cols = 1 + Math.floor(Math.random() * 3);
    const g = Array.from({ length: rows }, () => Array.from({ length: cols }, () => "AB"[Math.floor(Math.random() * 2)]).join(""));
    const code = Array.from({ length: 1 + Math.floor(Math.random() * 5) }, () => "AB"[Math.floor(Math.random() * 2)]).join("");
    assert.equal(gridHasCode(g, code), bruteForce(g, code), JSON.stringify({ g, code }));
  }
});

test("a 6 x 6 grid and 200 codes of 10 letters, in under 100 ms", () => {
  const letters = "ABCDEFGH";
  const pick = () => letters[Math.floor(Math.random() * letters.length)];
  const g = Array.from({ length: 6 }, () => Array.from({ length: 6 }, pick).join(""));
  const codes = Array.from({ length: 200 }, () => Array.from({ length: 10 }, pick).join(""));
  const start = performance.now();
  const answers = codes.map((code) => gridHasCode(g, code));
  const ms = performance.now() - start;
  assert.equal(answers.length, 200);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
