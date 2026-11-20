// Research only: the research's first keysInRange crashed when every key was below low. node range-bug.ts
import { build } from "./bst.ts";
function keysInRange(root: any, low: number, high: number): number[] {
  const out: number[] = []; const stack: any[] = []; let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) { if (cur.key < low) cur = cur.right; else { stack.push(cur); cur = cur.left; } }
    const node = stack.pop()!;
    if (node.key > high) break;
    out.push(node.key); cur = node.right;
  }
  return out;
}
try { console.log(keysInRange(build([5, 3, 8]), 9, 20)); } catch (e) { console.log("original:", (e as Error).message); }
