// Tests for the code in the reading: node --test "*.test.ts"
import { test } from "node:test";
import assert from "node:assert/strict";
import { deepChain, wideTree, type Folder } from "./folders.ts";
import { maxDepth } from "./opening-slow.ts";
import { maxDepthStack, maxDepthTwoStacks, maxDepthLevels } from "./opening-fast.ts";
import { build, has, height, inOrder, insert, shuffled, type TreeNode } from "./bst.ts";
import { folderTotals, namesInOrder, nearestPath } from "./variations.ts";

// A random tree: folder i goes inside a random earlier folder, with a random size and a name from a small set.
function randomTree(n: number): Folder {
  const all: Folder[] = [];
  for (let i = 0; i < n; i++) {
    const folder: Folder = { name: `n${Math.floor(Math.random() * 20)}`, size: Math.floor(Math.random() * 100), children: [] };
    if (i > 0) all[Math.floor(Math.random() * i)].children.push(folder);
    all.push(folder);
  }
  return all[0];
}

test("the four maxDepth versions agree", () => {
  const one: Folder = { name: "x", size: 0, children: [] };
  for (const fn of [maxDepth, maxDepthStack, maxDepthTwoStacks, maxDepthLevels]) assert.equal(fn(one), 1);
  const depths = new Set<number>();
  for (let r = 0; r < 200; r++) {
    const tree = randomTree(1 + Math.floor(Math.random() * 300));
    const want = maxDepth(tree);
    depths.add(want);
    assert.equal(maxDepthStack(tree), want);
    assert.equal(maxDepthTwoStacks(tree), want);
    assert.equal(maxDepthLevels(tree), want);
  }
  assert.ok(depths.size > 5, "random trees of many depths");
  assert.equal(maxDepthLevels(wideTree(21)), 3); // 1 + 4 + 16 folders
});

test("the loops handle a chain 1,000,000 deep", () => {
  const chain = deepChain(1_000_000);
  assert.equal(maxDepthStack(chain), 1_000_000);
  assert.equal(maxDepthTwoStacks(chain), 1_000_000);
  assert.equal(maxDepthLevels(chain), 1_000_000);
});

test("insert, has and inOrder against a Set", () => {
  for (let r = 0; r < 50; r++) {
    let root: TreeNode | null = null;
    const set = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const k = Math.floor(Math.random() * 300); // many duplicates
      root = insert(root, k);
      set.add(k);
    }
    assert.deepEqual(inOrder(root), [...set].sort((a, b) => a - b));
    for (let k = -1; k <= 300; k++) assert.equal(has(root, k), set.has(k));
  }
  assert.deepEqual(inOrder(null), []);
});

test("height: sorted keys make a chain", () => {
  assert.equal(height(null), 0);
  assert.equal(height(build([40, 20, 60, 10, 30, 50, 70])), 3);
  assert.equal(height(build(Array.from({ length: 20_000 }, (_, i) => i))), 20_000);
  assert.deepEqual(inOrder(build(shuffled(10_000))), Array.from({ length: 10_000 }, (_, i) => i));
});

test("variations against recursive versions", () => {
  const preorder = (x: Folder): string[] => [x.name, ...x.children.flatMap(preorder)];
  const total = (x: Folder): number => x.size + x.children.reduce((s, c) => s + total(c), 0);
  for (let r = 0; r < 100; r++) {
    const tree = randomTree(1 + Math.floor(Math.random() * 200));
    assert.deepEqual(namesInOrder(tree), preorder(tree));
    const totals = folderTotals(tree);
    const walk = (x: Folder): void => {
      assert.equal(totals.get(x), total(x));
      x.children.forEach(walk);
    };
    walk(tree);
  }
});

test("nearestPath finds the match closest to the root", () => {
  const f = (name: string, ...children: Folder[]): Folder => ({ name, size: 0, children });
  const home = f("home", f("docs", f("old", f("tax"))), f("tax"));
  assert.deepEqual(nearestPath(home, "tax"), ["home", "tax"]);
  assert.deepEqual(nearestPath(home, "home"), ["home"]);
  assert.equal(nearestPath(home, "music"), null);
  assert.equal(nearestPath(deepChain(200_000), "f199999")!.length, 200_000);
});
