import type { TreeNode } from "../bst.ts";

// Exercise 5: the keys k with low <= k <= high, in increasing order.
// Do not visit subtrees that cannot hold a key in the range.
// The in-order walk from the reading, with two cuts: skip a node and its left subtree when the
// node is below `low`, and stop at the first key above `high`. O(h + m) time for m keys, O(h) memory.
export function keysInRange(root: TreeNode | null, low: number, high: number): number[] {
  const out: number[] = [];
  const stack: TreeNode[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      if (cur.key < low) cur = cur.right; // cur and its whole left subtree are too small
      else {
        stack.push(cur);
        cur = cur.left;
      }
    }
    if (stack.length === 0) break;
    const node = stack.pop()!;
    if (node.key > high) break; // every later key is larger still
    out.push(node.key);
    cur = node.right;
  }
  return out;
}
