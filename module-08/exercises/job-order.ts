// Exercise 2: one worker runs jobs one at a time, each to the end. Whenever the worker is free,
// it takes the shortest job that has arrived; ties go to the earlier arrival, then the smaller id.
// If no job is waiting, the worker waits for the next one to arrive. Returns the ids in run order.
// You may import the Heap from "../heap.ts".
export type Job = { id: string; arrive: number; length: number };

export function jobOrder(jobs: Job[]): string[] {
  throw new Error("not implemented");
}
