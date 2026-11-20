import type { ListNode } from "../list.ts";

export type Entry = { time: number; text: string };

// Exercise 2: merge two lists of log entries, each sorted by time, into one sorted list.
// Relink the existing nodes; on equal times take the entry from `a` first.
// A dummy head and a tail pointer: O(n + m) time, O(1) extra memory.
export function mergeSorted(a: ListNode<Entry> | null, b: ListNode<Entry> | null): ListNode<Entry> | null {
  const dummy: ListNode<Entry> = { value: { time: 0, text: "" }, next: null };
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.value.time <= b.value.time) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b; // one list is empty; attach the rest of the other
  return dummy.next;
}
