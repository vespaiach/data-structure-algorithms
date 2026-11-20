// Research only: the longest dependency chain the recursive buildOrderDfs handles.
// Each try runs in a fresh process, so the JIT has not compiled the function before it,
// unless "warm" first runs it on 500 graphs of 200 packages. node dfs-limit.ts
import { execFileSync } from "node:child_process";
import { buildOrderDfs } from "./variations.ts";
import { makePackages } from "./packages.ts";

if (process.argv[2] === "try") {
  const n = Number(process.argv[3]);
  if (process.argv[4] === "warm") for (let i = 0; i < 500; i++) buildOrderDfs(makePackages(200));
  try {
    buildOrderDfs(makePackages(n));
    console.log("ok");
  } catch (err) {
    console.log((err as Error).name);
  }
} else {
  for (const mode of ["cold", "warm"]) {
    let ok = 1, bad = 100_000; // ok works, bad throws
    while (bad - ok > 1) {
      const mid = (ok + bad) >> 1;
      const out = execFileSync(process.execPath, [import.meta.filename, "try", String(mid), mode]).toString().trim();
      if (out === "ok") ok = mid;
      else bad = mid;
    }
    console.log(`longest chain, ${mode}: ${ok}`);
  }
}
