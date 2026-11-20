// Common mistakes with trees, and the wrong output each one gives: node mistakes.ts
import { wideTree, type Folder } from "./folders.ts";
import type { TreeNode } from "./bst.ts";
import { maxDepthLevels } from "./opening-fast.ts";

const f = (name: string, ...children: Folder[]): Folder => ({ name, size: 0, children });
const home = f("home", f("docs", f("tax"), f("old")), f("photos", f("2024")));

// 1. BFS with one queue and no level boundary: every folder lands in one list.
function levelsBad(root: Folder): string[][] {
  const out: string[] = [];
  const queue = [root];
  for (let i = 0; i < queue.length; i++) {
    out.push(queue[i].name);
    queue.push(...queue[i].children);
  }
  return [out];
}
console.log("1. levels without a boundary:", JSON.stringify(levelsBad(home)));

// 2. Depth counted in edges in one place and in folders in another: off by one.
function depthEdges(folder: Folder): number {
  let deepest = 0;
  for (const c of folder.children) deepest = Math.max(deepest, 1 + depthEdges(c));
  return deepest;
}
console.log("2. depth of a single folder, counting edges:", depthEdges(f("x")), "(the module counts folders: 1)");

// 3. Checking only each node against its children: accepts a tree that is not a BST.
const t = (key: number, left: TreeNode | null = null, right: TreeNode | null = null): TreeNode => ({ key, left, right });
function isBstBad(n: TreeNode | null): boolean {
  if (n === null) return true;
  if (n.left && n.left.key >= n.key) return false;
  if (n.right && n.right.key <= n.key) return false;
  return isBstBad(n.left) && isBstBad(n.right);
}
console.log("3. is 5(3, 6(4)) a BST?", isBstBad(t(5, t(3), t(6, t(4)))), "(want false: 4 < 5 sits on 5's right)");

// 4. Explicit-stack DFS that pushes children in order: visits them last to first.
const visited: string[] = [];
const stack = [home];
while (stack.length > 0) {
  const cur = stack.pop()!;
  visited.push(cur.name);
  stack.push(...cur.children);
}
console.log("4. stack DFS order:", visited.join(" "), "(recursive order: home docs tax old photos 2024)");

// 5. BFS with an array and shift(): once the queue passes about 15,000 folders, every shift
// moves all of them (Module 5).
function maxDepthShift(root: Folder): number {
  const queue: Folder[] = [root];
  let depth = 0;
  while (queue.length > 0) {
    depth++;
    for (let left = queue.length; left > 0; left--) queue.push(...queue.shift()!.children);
  }
  return depth;
}
for (const [label, walk] of [["shift()", maxDepthShift], ["Deque", maxDepthLevels]] as const) {
  const tree = wideTree(100_000);
  const start = performance.now();
  const depth = walk(tree);
  console.log(`5. BFS with ${label} on 100,000 folders: depth ${depth}, ${Math.round(performance.now() - start)} ms`);
}
