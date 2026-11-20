import type { Folder } from "../folders.ts";

// A correct answer to Exercise 1 that recursion limits: one call per level, so a deep chain
// throws RangeError: Maximum call stack size exceeded.
export function totalSize(root: Folder): number {
  let total = root.size;
  for (const child of root.children) total += totalSize(child);
  return total;
}
