import type { Folder } from "../folders.ts";

// A correct but slow answer to Exercise 2: a queue on an array with shift(), which moves
// every waiting folder once the queue passes about 15,000 (Module 5).
export function namesByLevel(root: Folder): string[][] {
  const out: string[][] = [];
  const queue: Folder[] = [root];
  while (queue.length > 0) {
    const names: string[] = [];
    for (let left = queue.length; left > 0; left--) {
      const folder = queue.shift()!;
      names.push(folder.name);
      for (const child of folder.children) queue.push(child);
    }
    out.push(names);
  }
  return out;
}
