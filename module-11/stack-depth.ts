// The most steps the top-down waysMemo handles before the call stack runs out: node stack-depth.ts
// Each try runs in a fresh process. "cold" calls waysMemo once; "warm" first runs it 2,000 times
// on 1,000 steps, so the JIT has compiled it.
import { execFileSync } from "node:child_process";
import { waysMemo, waysTable } from "./opening-fast.ts";

if (process.argv[2] === "try") {
  const n = Number(process.argv[3]);
  if (process.argv[4] === "warm") for (let i = 0; i < 2_000; i++) waysMemo(1_000);
  try {
    waysMemo(n);
    console.log("ok");
  } catch (err) {
    console.log((err as Error).name);
  }
} else {
  for (const mode of ["cold", "warm"]) {
    let ok = 1, bad = 1_000_000; // ok works, bad throws
    while (bad - ok > 1) {
      const mid = ok + Math.floor((bad - ok) / 2);
      const out = execFileSync(process.execPath, [import.meta.filename, "try", String(mid), mode]).toString().trim();
      if (out === "ok") ok = mid;
      else bad = mid;
    }
    console.log(`most steps waysMemo handles, ${mode}: ${ok.toLocaleString("en-US")}`);
  }
  try {
    waysMemo(100_000);
  } catch (err) {
    console.log("waysMemo(100000):", `${(err as Error).name}: ${(err as Error).message}`);
  }
  console.log("waysTable(100000):", waysTable(100_000));
}
