// Three more shapes of a tree walk: node variations.ts
import { Deque } from "./deque.ts";
import type { Folder } from "./folders.ts";

// Folder names in the order the recursive walk visits them: a parent, then each child's
// subtree, first child first. Explicit stack with the children pushed in reverse. O(n) time.
export function namesInOrder(root: Folder): string[] {
  const out: string[] = [];
  const stack: Folder[] = [root];
  while (stack.length > 0) {
    const folder = stack.pop()!;
    out.push(folder.name);
    for (let i = folder.children.length - 1; i >= 0; i--) stack.push(folder.children[i]);
  }
  return out;
}

// Each folder's size plus the sizes of everything inside it. A folder's total needs its
// children's totals first, so walk the folders backward from a parent-first order.
// O(n) time, O(n) memory for the order and the map.
export function folderTotals(root: Folder): Map<Folder, number> {
  const order: Folder[] = []; // every parent comes before its children
  const stack: Folder[] = [root];
  while (stack.length > 0) {
    const folder = stack.pop()!;
    order.push(folder);
    for (const child of folder.children) stack.push(child);
  }
  const totals = new Map<Folder, number>();
  for (let i = order.length - 1; i >= 0; i--) {
    let total = order[i].size;
    for (const child of order[i].children) total += totals.get(child)!; // ready: children come later in `order`
    totals.set(order[i], total);
  }
  return totals;
}

// The path to the folder called `name` that is closest to the root, or null.
// Breadth first, so the first match is on the highest level that has one.
// A map from each folder to its parent rebuilds the path. O(n) time, O(n) memory.
export function nearestPath(root: Folder, name: string): string[] | null {
  const parent = new Map<Folder, Folder | null>([[root, null]]);
  const queue = new Deque<Folder>();
  queue.push(root);
  while (queue.size > 0) {
    const folder = queue.shift()!;
    if (folder.name === name) {
      const path: string[] = [];
      for (let f: Folder | null = folder; f !== null; f = parent.get(f)!) path.push(f.name);
      return path.reverse();
    }
    for (const child of folder.children) {
      parent.set(child, folder);
      queue.push(child);
    }
  }
  return null;
}

if (process.argv[1] === import.meta.filename) {
  const f = (name: string, size: number, ...children: Folder[]): Folder => ({ name, size, children });
  const home = f("home", 1, f("docs", 2, f("old", 4, f("tax", 5))), f("tax", 3), f("photos", 6, f("2024", 7)));
  console.log("namesInOrder:", namesInOrder(home).join(" "));
  const totals = folderTotals(home);
  console.log("folderTotals:", [...totals].map(([folder, total]) => `${folder.name} ${total}`).join(", "));
  console.log("nearestPath(home, 'tax'):", nearestPath(home, "tax")?.join("/"));
}
