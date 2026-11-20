// Exercise 2: one worker runs jobs one at a time, each to the end. Whenever the worker is free,
// it takes the shortest job that has arrived; ties go to the earlier arrival, then the smaller id.
// If no job is waiting, the worker waits for the next one to arrive. Returns the ids in run order.
// Sort the jobs by arrival, and keep the jobs that have arrived in a heap.
// O(n log n) time, O(n) memory.
import { Heap } from "../heap.ts";

export type Job = { id: string; arrive: number; length: number };

export function jobOrder(jobs: Job[]): string[] {
  const byArrival = jobs.toSorted((a, b) => a.arrive - b.arrive);
  const waiting = new Heap<Job>((a, b) =>
    a.length !== b.length ? a.length < b.length : a.arrive !== b.arrive ? a.arrive < b.arrive : a.id < b.id);
  const order: string[] = [];
  let time = 0;
  let next = 0; // the first job in byArrival that has not arrived yet
  while (order.length < jobs.length) {
    if (waiting.size === 0 && byArrival[next].arrive > time) time = byArrival[next].arrive; // idle until it arrives
    while (next < byArrival.length && byArrival[next].arrive <= time) waiting.push(byArrival[next++]);
    const job = waiting.pop()!;
    order.push(job.id);
    time += job.length;
  }
  return order;
}
