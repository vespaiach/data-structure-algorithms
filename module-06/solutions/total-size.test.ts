import { test } from "node:test";
import assert from "node:assert/strict";
import { deepChain, wideTree, type Folder } from "../folders.ts";
import { totalSize } from "./total-size.ts";

test("small tree", () => {
  const root: Folder = {
    name: "app", size: 10, children: [
      { name: "src", size: 5, children: [{ name: "lib", size: 7, children: [] }] },
      { name: "docs", size: 3, children: [] },
    ],
  };
  assert.equal(totalSize(root), 25);
});
test("one folder", () => {
  assert.equal(totalSize({ name: "x", size: 4, children: [] }), 4);
});
test("wide tree of 100,000", () => {
  assert.equal(totalSize(wideTree(100_000)), 100_000);
});
test("chain 1,000,000 deep", () => {
  assert.equal(totalSize(deepChain(1_000_000)), 1_000_000);
});
