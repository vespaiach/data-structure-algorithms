import type { ListNode } from "./list.ts";

// O(n) time, O(1) memory: each node's next is flipped once.
export function reverseList<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let node = head;
  while (node !== null) {
    const next = node.next; // save before overwriting
    node.next = prev;
    prev = node;
    node = next;
  }
  return prev;
}
