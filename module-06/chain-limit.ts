// Research only: the deepest chain that recursive maxDepth handles, before and after the JIT
// has compiled it. Binary search on the chain length. node chain-limit.ts
import { deepChain, wideTree } from "./folders.ts";
import { maxDepth } from "./opening-slow.ts";

function limit(): number {
  let ok = 1, bad = 1_000_000; // ok works, bad throws
  while (bad - ok > 1) {
    const mid = (ok + bad) >> 1;
    try {
      maxDepth(deepChain(mid));
      ok = mid;
    } catch {
      bad = mid;
    }
  }
  return ok;
}

console.log("deepest chain, cold:", limit());
for (let i = 0; i < 20; i++) maxDepth(wideTree(100_000));
console.log("deepest chain, after 20 runs on a wide tree:", limit());
