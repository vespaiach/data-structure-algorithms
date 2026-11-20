// Exercise 1: simplify an absolute file path. "." means this folder, ".." the parent folder
// (the root's parent is the root), and empty parts from "//" are dropped. Return a path that
// starts with "/" and has no "/" at the end, except the root itself, "/".
// A stack of folder names: O(n) time and memory for a path of n characters.
export function simplifyPath(path: string): string {
  const folders: string[] = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") folders.pop(); // pop() of an empty stack does nothing and returns undefined
    else folders.push(part);
  }
  return "/" + folders.join("/");
}
