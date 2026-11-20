// A job runner keeps its tasks in an array. Remove the done ones, and take tasks off the front.
import { bench } from "./bench.ts";

export type Task = { id: number; done: boolean };

export function makeTasks(n: number): Task[] {
  const tasks: Task[] = [];
  for (let i = 0; i < n; i++) tasks.push({ id: i, done: i % 2 === 0 }); // every other task is done
  return tasks;
}

// Each splice(i, 1) moves every task after i one slot left.
export function removeDone(tasks: Task[]): Task[] {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) tasks.splice(i, 1);
  }
  return tasks;
}

// Takes every task off the front with shift(), and adds up their IDs.
export function drainFront(tasks: Task[]): number {
  let sum = 0;
  while (tasks.length > 0) sum += tasks.shift()!.id;
  return sum;
}

if (process.argv[1] === import.meta.filename) {
  bench("removeDone with splice", [25_000, 50_000, 100_000], makeTasks, removeDone);
  bench("drainFront with shift", [25_000, 50_000, 100_000], makeTasks, drainFront);
}
