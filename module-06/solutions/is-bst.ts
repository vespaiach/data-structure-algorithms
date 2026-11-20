import type { TreeNode } from "../bst.ts";

// Exercise 4: true when the tree is a binary search tree with no duplicate keys:
// every key in a node's left subtree is smaller than the node's key, every key in its right subtree larger.
// Each node carries the bounds its ancestors set, on an explicit stack: O(n) time,
// O(h) memory (at most one waiting sibling per level of the current path).
export function isBst(root: TreeNode | null): boolean {
  const stack: [TreeNode | null, number, number][] = [[root, -Infinity, Infinity]];
  while (stack.length > 0) {
    const [node, low, high] = stack.pop()!;
    if (node === null) continue;
    if (node.key <= low || node.key >= high) return false;
    stack.push([node.left, low, node.key], [node.right, node.key, high]);
  }
  return true;
}
