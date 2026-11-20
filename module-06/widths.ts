// Research only: the height, the widest level and the largest explicit-stack size of the wide trees.
// node widths.ts
import { wideTree, type Folder } from "./folders.ts";

for (const n of [100_000, 200_000, 1_000_000]) {
  const root = wideTree(n);
  const widths: number[] = [];
  let level: Folder[] = [root];
  while (level.length > 0) {
    widths.push(level.length);
    level = level.flatMap((f) => f.children);
  }
  let most = 0;
  const stack: Folder[] = [root];
  while (stack.length > 0) {
    most = Math.max(most, stack.length);
    stack.push(...stack.pop()!.children);
  }
  console.log(`n = ${n}: height ${widths.length}, widest level ${Math.max(...widths)}, largest DFS stack ${most}`);
}
