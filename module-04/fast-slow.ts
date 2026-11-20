import type { ListNode } from "./list.ts";

// Fast and slow pointers: fast moves two nodes per step, slow moves one.

// The middle node in one pass. O(n) time, O(1) memory.
// For an even length this returns the second of the two middle nodes.
export function middleNode<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// Does following next from the head ever come back to a node it passed? O(n) time, O(1) memory.
// Without a cycle, fast reaches the end. With one, fast gains one node per step on slow, so they meet.
export function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
