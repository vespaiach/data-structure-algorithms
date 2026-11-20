// The opening numbers: 100,000 rounds (ROUNDS) with 200,000 jobs waiting, once per queue. node one-large-run.ts
// Each backlog is built right before its run, as bench.ts does, and building it is not timed.
import { makeBacklog, ROUNDS, type Job } from "./opening-slow.ts";
import { IndexQueue } from "./index-queue.ts";
import { Deque } from "./deque.ts";

const WAITING = 200_000;
type Queue = { push(j: Job): void; shift(): Job | undefined };

function time(label: string, q: Queue): void {
  const start = performance.now();
  let sum = 0;
  for (let i = 0; i < ROUNDS; i++) {
    sum += q.shift()!.id;
    q.push({ id: i });
  }
  const ms = performance.now() - start;
  console.log(label.padEnd(14) + ms.toFixed(1).padStart(10) + " ms   (sum " + sum + ")");
}

function filled<Q extends Queue>(q: Q): Q {
  for (const job of makeBacklog(WAITING)) q.push(job);
  return q;
}
time("array + shift", makeBacklog(WAITING));
time("head index", filled(new IndexQueue<Job>()));
time("ring buffer", filled(new Deque<Job>()));
