// The deepest folder with an explicit stack (depth first) and with a queue (breadth first).
// node opening-fast.ts
import { bench } from "./bench.ts";
import { Deque } from "./deque.ts";
import { deepChain, wideTree, type Folder } from "./folders.ts";
import { maxDepth } from "./opening-slow.ts";

// Depth first with a stack of [folder, depth] pairs. O(n) time. The stack is an array on the heap,
// so a deep tree only costs memory: O(n) in the worst case.
export function maxDepthStack(root: Folder): number {
  let deepest = 0;
  const stack: [Folder, number][] = [[root, 1]];
  while (stack.length > 0) {
    const [folder, depth] = stack.pop()!;
    if (depth > deepest) deepest = depth;
    for (const child of folder.children) stack.push([child, depth + 1]);
  }
  return deepest;
}

// The same walk with two parallel stacks, so no [folder, depth] array is allocated per folder.
export function maxDepthTwoStacks(root: Folder): number {
  let deepest = 0;
  const folders: Folder[] = [root];
  const depths: number[] = [1];
  while (folders.length > 0) {
    const folder = folders.pop()!;
    const depth = depths.pop()!;
    if (depth > deepest) deepest = depth;
    for (const child of folder.children) {
      folders.push(child);
      depths.push(depth + 1);
    }
  }
  return deepest;
}

// Breadth first, one level at a time, with Module 5's Deque as the queue.
// O(n) time; O(w) memory, where w is the number of folders on the widest level.
export function maxDepthLevels(root: Folder): number {
  const queue = new Deque<Folder>();
  queue.push(root);
  let depth = 0;
  while (queue.size > 0) {
    depth++;
    // Here the queue holds exactly one level: take that many folders and queue their children.
    for (let left = queue.size; left > 0; left--) {
      const folder = queue.shift()!;
      for (const child of folder.children) queue.push(child);
    }
  }
  return depth;
}

if (process.argv[1] === import.meta.filename) {
  const sizes = [250_000, 500_000, 1_000_000];
  bench("recursive maxDepth, wide tree", sizes, (n) => wideTree(n), maxDepth);
  bench("maxDepthStack, wide tree", sizes, (n) => wideTree(n), maxDepthStack);
  bench("maxDepthTwoStacks, wide tree", sizes, (n) => wideTree(n), maxDepthTwoStacks);
  bench("maxDepthLevels, wide tree", sizes, (n) => wideTree(n), maxDepthLevels);
  bench("maxDepthStack, chain", sizes, deepChain, maxDepthStack);
  bench("maxDepthLevels, chain", sizes, deepChain, maxDepthLevels);
  const chain = deepChain(1_000_000);
  console.log("\nchain of 1,000,000:", maxDepthStack(chain), maxDepthTwoStacks(chain), maxDepthLevels(chain));
}
