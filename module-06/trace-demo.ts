// Prints Figures 2, 3, 4 and 8 of the module: node trace-demo.ts
// The loops are the loops of maxDepth, maxDepthStack, maxDepthLevels and inOrder, with a print added,
// and each result is checked against the real function.
import assert from "node:assert/strict";
import { Deque } from "./deque.ts";
import type { Folder } from "./folders.ts";
import { maxDepth } from "./opening-slow.ts";
import { maxDepthStack, maxDepthLevels } from "./opening-fast.ts";
import { build, inOrder, type TreeNode } from "./bst.ts";

const f = (name: string, ...children: Folder[]): Folder => ({ name, size: 0, children });
const home = f("home", f("docs", f("tax"), f("old")), f("photos", f("2024")));

console.log("Figure 2: maxDepth(home)\n");
console.log("step              calls waiting, bottom on the left");
{
  const calls: string[] = [];
  const row = (step: string) => console.log(step.padEnd(18) + (calls.join(" > ") || "(empty)"));
  function traced(folder: Folder): number {
    calls.push(folder.name);
    row(`call ${folder.name}`);
    let deepest = 0;
    for (const child of folder.children) deepest = Math.max(deepest, traced(child));
    calls.pop();
    row(`${folder.name} returns ${deepest + 1}`);
    return deepest + 1;
  }
  assert.equal(traced(home), maxDepth(home));
}

console.log("\nFigure 3: maxDepthStack(home)\n");
console.log("step          stack of [folder depth], top on the right   deepest");
{
  let deepest = 0;
  const stack: [Folder, number][] = [[home, 1]];
  const row = (step: string) => {
    const pairs = stack.map(([x, d]) => `[${x.name} ${d}]`).join(" ") || "(empty)";
    console.log(step.padEnd(14) + pairs.padEnd(47) + deepest);
  };
  row("start");
  while (stack.length > 0) {
    const [folder, depth] = stack.pop()!;
    if (depth > deepest) deepest = depth;
    for (const child of folder.children) stack.push([child, depth + 1]);
    row(`pop ${folder.name} ${depth}`);
  }
  assert.equal(deepest, maxDepthStack(home));
}

console.log("\nFigure 4: maxDepthLevels(home)\n");
console.log("depth   folders taken from the front   queue after (front on the left)");
{
  const queue = new Deque<Folder>();
  // Private fields are plain properties at run time, so the demo can read the queue's items.
  const inside = () => {
    const q = queue as unknown as { buf: Folder[]; head: number; count: number };
    return Array.from({ length: q.count }, (_, i) => q.buf[(q.head + i) & (q.buf.length - 1)].name);
  };
  queue.push(home);
  let depth = 0;
  while (queue.size > 0) {
    depth++;
    const taken: string[] = [];
    for (let left = queue.size; left > 0; left--) {
      const folder = queue.shift()!;
      taken.push(folder.name);
      for (const child of folder.children) queue.push(child);
    }
    console.log(String(depth).padEnd(8) + taken.join(", ").padEnd(31) + (inside().join(", ") || "(empty)"));
  }
  assert.equal(depth, maxDepthLevels(home));
}

console.log("\nFigure 8: inOrder(build([40, 20, 60, 10, 30, 50, 70]))\n");
console.log("nodes pushed   pop   stack after (top on the right)   output so far");
{
  const root = build([40, 20, 60, 10, 30, 50, 70]);
  const out: number[] = [];
  const stack: TreeNode[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    const pushed: number[] = [];
    while (cur !== null) {
      stack.push(cur);
      pushed.push(cur.key);
      cur = cur.left;
    }
    const node = stack.pop()!;
    out.push(node.key);
    cur = node.right;
    const p = pushed.join(", ") || "-";
    console.log(p.padEnd(15) + String(node.key).padEnd(6) + `[${stack.map((n) => n.key).join(", ")}]`.padEnd(34) + out.join(" "));
  }
  assert.deepEqual(out, inOrder(root));
}
