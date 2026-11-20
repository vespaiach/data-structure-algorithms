// Opening problem: a work queue on push() and shift(). The backlog holds n jobs;
// each round takes one job off the front and adds a new one at the back.
import { bench } from "./bench.ts";

export type Job = { id: number };
export const ROUNDS = 100_000;

export function makeBacklog(n: number): Job[] {
  const q: Job[] = [];
  for (let i = 0; i < n; i++) q.push({ id: i });
  return q;
}

// Once the array passes about 15,000 jobs, each shift() moves every remaining job one slot left.
export function runArrayQueue(q: Job[]): number {
  let sum = 0;
  for (let i = 0; i < ROUNDS; i++) {
    sum += q.shift()!.id;
    q.push({ id: i });
  }
  return sum;
}

if (process.argv[1] === import.meta.filename) {
  bench(`array queue, ${ROUNDS} rounds (n = jobs waiting)`, [10_000, 20_000, 40_000, 80_000], makeBacklog, runArrayQueue);
}
