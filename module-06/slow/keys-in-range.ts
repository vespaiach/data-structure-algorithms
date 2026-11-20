import type { TreeNode } from "../bst.ts";
import { inOrder } from "../bst.ts";

// A correct but slow answer to Exercise 5: walk the whole tree in order, then filter. O(n) per query.
export function keysInRange(root: TreeNode | null, low: number, high: number): number[] {
  return inOrder(root).filter((k) => k >= low && k <= high);
}
