import type { ListNode } from "../list.ts";

// Exercise 1: a log is a list of entries from oldest to newest.
// Return the node k places from the end (k = 1 is the newest entry), or null if the list
// has fewer than k entries. Walk the list once and use O(1) extra memory.
// Two pointers k nodes apart: O(n) time, O(1) memory.
export function nthFromEnd<T>(head: ListNode<T> | null, k: number): ListNode<T> | null {
  let lead = head;
  for (let i = 0; i < k; i++) {
    if (lead === null) return null; // fewer than k entries
    lead = lead.next;
  }
  let trail = head;
  while (lead !== null) {
    lead = lead.next;
    trail = trail!.next;
  }
  return trail;
}
