// Research only: a Worker thread gets its own stack, sized by resourceLimits.stackSizeMb.
// node worker-stack.ts
import { Worker, isMainThread, workerData, parentPort } from "node:worker_threads";
import { deepChain } from "./folders.ts";
import { maxDepth } from "./opening-slow.ts";

if (isMainThread) {
  for (const stackSizeMb of [4, 64]) {
    const worker = new Worker(import.meta.filename, { workerData: 100_000, resourceLimits: { stackSizeMb } });
    worker.on("message", (m) => console.log(`stackSizeMb ${stackSizeMb}: chain of 100,000 ->`, m));
    worker.on("error", (e) => console.log(`stackSizeMb ${stackSizeMb}: ${e.name}: ${e.message}`));
  }
} else {
  parentPort!.postMessage(maxDepth(deepChain(workerData)));
}
