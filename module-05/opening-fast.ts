// The same work queue with a head index and with a ring buffer.
import { bench } from "./bench.ts";
import { makeBacklog, ROUNDS, type Job } from "./opening-slow.ts";
import { IndexQueue } from "./index-queue.ts";
import { Deque } from "./deque.ts";

type Queue = { push(j: Job): void; shift(): Job | undefined };

function fill<Q extends Queue>(q: Q, n: number): Q {
  for (const job of makeBacklog(n)) q.push(job);
  return q;
}

export function runQueue(q: Queue): number {
  let sum = 0;
  for (let i = 0; i < ROUNDS; i++) {
    sum += q.shift()!.id;
    q.push({ id: i });
  }
  return sum;
}

if (process.argv[1] === import.meta.filename) {
  const sizes = [10_000, 20_000, 40_000, 80_000];
  bench(`head-index queue, ${ROUNDS} rounds`, sizes, (n) => fill(new IndexQueue<Job>(), n), runQueue);
  bench(`ring buffer queue, ${ROUNDS} rounds`, sizes, (n) => fill(new Deque<Job>(), n), runQueue);
}
