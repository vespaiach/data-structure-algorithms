import { test } from "node:test";
import assert from "node:assert/strict";
import { build, shuffled, type TreeNode } from "../bst.ts";
import { isBst } from "./is-bst.ts";

const t = (key: number, left: TreeNode | null = null, right: TreeNode | null = null): TreeNode => ({ key, left, right });

test("valid trees", () => {
  assert.equal(isBst(null), true);
  assert.equal(isBst(t(5, t(3, t(1), t(4)), t(8, null, t(9)))), true);
  assert.equal(isBst(build(shuffled(10_000))), true);
});
test("a child on the wrong side", () => {
  assert.equal(isBst(t(5, t(6))), false);
});
test("a grandchild that breaks an ancestor's bound", () => {
  // 4 is a valid left child of 6, but it sits in 5's right subtree and 4 < 5.
  assert.equal(isBst(t(5, t(3), t(6, t(4)))), false);
});
test("duplicates are not allowed", () => {
  assert.equal(isBst(t(5, t(5))), false);
});
test("a tall tree of 30,000 sorted keys", () => {
  assert.equal(isBst(build(Array.from({ length: 30_000 }, (_, i) => i))), true);
});
