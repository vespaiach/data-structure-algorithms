import type { ListNode } from "../list.ts";

export type Entry = { time: number; text: string };

// Exercise 2: merge two lists of log entries, each sorted by time, into one sorted list.
// Relink the existing nodes; on equal times take the entry from `a` first.
export function mergeSorted(a: ListNode<Entry> | null, b: ListNode<Entry> | null): ListNode<Entry> | null {
  throw new Error("not implemented");
}
