import type { Folder } from "../folders.ts";

// Exercise 1: the sum of `size` over the folder and every folder inside it.
// It must work on a chain 1,000,000 folders deep.
// Depth first with an explicit stack: O(n) time, O(n) memory in the worst case, no call stack limit.
export function totalSize(root: Folder): number {
  let total = 0;
  const stack: Folder[] = [root];
  while (stack.length > 0) {
    const folder = stack.pop()!;
    total += folder.size;
    for (const child of folder.children) stack.push(child);
  }
  return total;
}
