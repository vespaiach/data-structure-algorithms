import type { TreeNode } from "../bst.ts";

// A correct answer to Exercise 4 that recursion limits: a tall tree throws a RangeError.
export function isBst(root: TreeNode | null, low = -Infinity, high = Infinity): boolean {
  if (root === null) return true;
  if (root.key <= low || root.key >= high) return false;
  return isBst(root.left, low, root.key) && isBst(root.right, root.key, high);
}
