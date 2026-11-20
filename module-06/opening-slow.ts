// Opening problem: how deep is the deepest folder? The recursive version: node opening-slow.ts
import { bench } from "./bench.ts";
import { deepChain, wideTree, type Folder } from "./folders.ts";

// The number of folders on the longest path from `folder` down, counting `folder`.
// O(n) time; one call per level, so O(h) memory on the call stack for a tree h folders deep.
export function maxDepth(folder: Folder): number {
  let deepest = 0;
  for (const child of folder.children) deepest = Math.max(deepest, maxDepth(child));
  return deepest + 1;
}

if (process.argv[1] === import.meta.filename) {
  bench("recursive maxDepth, wide tree", [100_000, 200_000, 400_000], (n) => wideTree(n), maxDepth);
  for (const depth of [1_000, 5_000, 10_000, 20_000]) {
    console.log(`chain of ${depth}:`, maxDepth(deepChain(depth)));
  }
}
