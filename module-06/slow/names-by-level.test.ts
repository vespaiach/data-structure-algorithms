import { test } from "node:test";
import assert from "node:assert/strict";
import { deepChain, wideTree, type Folder } from "../folders.ts";
import { namesByLevel } from "./names-by-level.ts";

const f = (name: string, ...children: Folder[]): Folder => ({ name, size: 0, children });

test("three levels", () => {
  const root = f("home", f("docs", f("tax"), f("old")), f("photos", f("2024")));
  assert.deepEqual(namesByLevel(root), [["home"], ["docs", "photos"], ["tax", "old", "2024"]]);
});
test("one folder", () => {
  assert.deepEqual(namesByLevel(f("x")), [["x"]]);
});
test("chain 100,000 deep", () => {
  const levels = namesByLevel(deepChain(100_000));
  assert.equal(levels.length, 100_000);
  assert.deepEqual(levels[99_999], ["f99999"]);
});
test("a wide tree of 200,000 folders in under 500 ms", () => {
  const tree = wideTree(200_000);
  const start = performance.now();
  const levels = namesByLevel(tree);
  const ms = performance.now() - start;
  assert.equal(levels.reduce((sum, names) => sum + names.length, 0), 200_000);
  assert.deepEqual(levels[1], ["f1", "f2", "f3", "f4"]);
  assert.ok(ms < 500, `took ${Math.round(ms)} ms`);
});
