import type { Folder } from "../folders.ts";

// A correct answer to Exercise 3 that recursion limits: a deep chain throws a RangeError.
export function findPath(root: Folder, name: string): string[] | null {
  if (root.name === name) return [root.name];
  for (const child of root.children) {
    const rest = findPath(child, name);
    if (rest !== null) return [root.name, ...rest];
  }
  return null;
}
