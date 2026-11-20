import type { Folder } from "../folders.ts";

// Exercise 3: the folder names from the root to the first folder called `name`, or null.
// "First" means first in depth-first order, visiting children in array order.
// It must work on a chain 1,000,000 folders deep.
// An explicit stack with the children pushed in reverse, and a map from each folder to its parent:
// O(n) time, O(n) memory.
export function findPath(root: Folder, name: string): string[] | null {
  const parent = new Map<Folder, Folder | null>([[root, null]]);
  const stack: Folder[] = [root];
  while (stack.length > 0) {
    const folder = stack.pop()!;
    if (folder.name === name) {
      const path: string[] = [];
      for (let f: Folder | null = folder; f !== null; f = parent.get(f)!) path.push(f.name);
      return path.reverse();
    }
    for (let i = folder.children.length - 1; i >= 0; i--) {
      parent.set(folder.children[i], folder);
      stack.push(folder.children[i]);
    }
  }
  return null;
}
