import { test } from "node:test";
import assert from "node:assert/strict";
import { deepChain, type Folder } from "../folders.ts";
import { findPath } from "./find-path.ts";

const f = (name: string, ...children: Folder[]): Folder => ({ name, size: 0, children });
const root = f("home", f("docs", f("tax"), f("old", f("tax"))), f("photos", f("2024")));

test("finds a nested folder", () => {
  assert.deepEqual(findPath(root, "2024"), ["home", "photos", "2024"]);
});
test("returns the first match in depth-first order", () => {
  assert.deepEqual(findPath(root, "tax"), ["home", "docs", "tax"]);
  // Depth first goes down docs before it looks at the second "tax", which is closer to the root.
  const other = f("home", f("docs", f("old", f("tax"))), f("tax"));
  assert.deepEqual(findPath(other, "tax"), ["home", "docs", "old", "tax"]);
});
test("the root itself and a missing name", () => {
  assert.deepEqual(findPath(root, "home"), ["home"]);
  assert.equal(findPath(root, "music"), null);
});
test("chain 1,000,000 deep", () => {
  const path = findPath(deepChain(1_000_000), "f999999")!;
  assert.equal(path.length, 1_000_000);
  assert.equal(path[0], "f0");
  assert.equal(path[999_999], "f999999");
});
