// A plain (unbalanced) binary search tree of numbers. For every node, the keys in its left
// subtree are smaller than its key, and the keys in its right subtree are larger.
import { Deque } from "./deque.ts";

export type TreeNode = { key: number; left: TreeNode | null; right: TreeNode | null };

// Adds `key` and returns the root. O(h): it walks one path down from the root.
// A loop, not recursion, so a tall tree cannot overflow the call stack.
export function insert(root: TreeNode | null, key: number): TreeNode {
  const node: TreeNode = { key, left: null, right: null };
  if (root === null) return node;
  let cur = root;
  while (true) {
    if (key === cur.key) return root; // no duplicates
    if (key < cur.key) {
      if (cur.left === null) {
        cur.left = node;
        return root;
      }
      cur = cur.left;
    } else {
      if (cur.right === null) {
        cur.right = node;
        return root;
      }
      cur = cur.right;
    }
  }
}

// O(h): one comparison per level.
export function has(root: TreeNode | null, key: number): boolean {
  let cur = root;
  while (cur !== null) {
    if (key === cur.key) return true;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return false;
}

// The keys in increasing order: the left subtree, then the node, then the right subtree.
// In-order walk with an explicit stack: O(n) time, O(h) memory.
export function inOrder(root: TreeNode | null): number[] {
  const out: number[] = [];
  const stack: TreeNode[] = []; // nodes whose left subtree is being walked
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur); // go left as far as possible
      cur = cur.left;
    }
    const node = stack.pop()!; // its left subtree is done
    out.push(node.key);
    cur = node.right;
  }
  return out;
}

// The number of levels, counted breadth first like maxDepthLevels. O(n).
export function height(root: TreeNode | null): number {
  const queue = new Deque<TreeNode>();
  if (root !== null) queue.push(root);
  let h = 0;
  while (queue.size > 0) {
    h++;
    for (let left = queue.size; left > 0; left--) {
      const node = queue.shift()!;
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return h;
}

export function build(keys: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const k of keys) root = insert(root, k);
  return root;
}

// The numbers 0 to n - 1 in random order (Fisher-Yates shuffle).
export function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

if (process.argv[1] === import.meta.filename) {
  const root = build([40, 20, 60, 10, 30, 50, 70]);
  console.log("inOrder:", inOrder(root).join(" "));
  console.log("has(30):", has(root, 30), " has(35):", has(root, 35), " height:", height(root));
  console.log("height with keys 10, 20, 30, 40 in order:", height(build([10, 20, 30, 40])));
}
