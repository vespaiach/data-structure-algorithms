import type { ListNode } from "../list.ts";

// Exercise 3: each page in a chain of redirects points to the next one.
// Return the first node of the cycle, or null if the chain ends. Use O(1) extra memory.
// Floyd's cycle detection: O(n) time, O(1) memory.
export function findCycleStart<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      // Phase 2: one pointer from the head, one from the meeting point, one step each.
      let a = head;
      let b: ListNode<T> | null = slow;
      while (a !== b) {
        a = a!.next;
        b = b!.next;
      }
      return a;
    }
  }
  return null;
}
