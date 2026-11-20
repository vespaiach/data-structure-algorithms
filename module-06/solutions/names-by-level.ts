import { Deque } from "../deque.ts";
import type { Folder } from "../folders.ts";

// Exercise 2: the folder names on each level, top level first, children in array order.
// Breadth first by level with a Deque: O(n) time, O(w) memory for the queue (w = widest level),
// plus O(n) for the answer.
export function namesByLevel(root: Folder): string[][] {
  const out: string[][] = [];
  const queue = new Deque<Folder>();
  queue.push(root);
  while (queue.size > 0) {
    const names: string[] = [];
    for (let left = queue.size; left > 0; left--) {
      const folder = queue.shift()!;
      names.push(folder.name);
      for (const child of folder.children) queue.push(child);
    }
    out.push(names);
  }
  return out;
}
