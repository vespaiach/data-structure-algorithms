// Common mistakes with linked lists and the wrong output each one gives. Run it and compare.
import { fromArray, toArray, type ListNode } from "./list.ts";

// 1. Reversing without saving next first: the rest of the list is lost.
function reverseNoSave(head: ListNode<number> | null): ListNode<number> | null {
  let prev: ListNode<number> | null = null;
  let node = head;
  while (node !== null) {
    node.next = prev; // next is overwritten before it is read
    prev = node;
    node = node.next; // now this is prev, so the loop ends
  }
  return prev;
}
console.log("1. reverse without saving next:", toArray(reverseNoSave(fromArray([1, 2, 3, 4]))));

// 2. Removing without a dummy head: the first node is never checked.
function removeNoDummy(head: ListNode<number> | null, bad: number): ListNode<number> | null {
  let prev = head;
  while (prev !== null && prev.next !== null) {
    if (prev.next.value === bad) prev.next = prev.next.next;
    else prev = prev.next;
  }
  return head;
}
console.log("2. remove 7 without a dummy head:", toArray(removeNoDummy(fromArray([7, 1, 7, 2]), 7)));

// 3. Moving prev after an unlink: the second of two neighbours is skipped.
function removeAlwaysAdvance(head: ListNode<number> | null, bad: number): ListNode<number> | null {
  const dummy: ListNode<number> = { value: 0, next: head };
  let prev: ListNode<number> | null = dummy;
  while (prev !== null && prev.next !== null) {
    if (prev.next.value === bad) prev.next = prev.next.next;
    prev = prev.next;
  }
  return dummy.next;
}
console.log("3. remove 7, always advancing prev:", toArray(removeAlwaysAdvance(fromArray([1, 7, 7, 2]), 7)));

// 4. Fast pointer loop that checks only fast.next: crashes on an even length.
function middleBad(head: ListNode<number>): number {
  let slow = head;
  let fast: ListNode<number> | null = head;
  while (fast!.next !== null) {
    slow = slow.next!;
    fast = fast!.next.next;
  }
  return slow.value;
}
try {
  console.log("4. middle of [1,2,3,4]:", middleBad(fromArray([1, 2, 3, 4])!));
} catch (err) {
  console.log("4. middle of [1,2,3,4]:", String(err));
}

// 5. Splicing while walking forward: the element after each removal is skipped.
const tasks = [7, 7, 1, 7, 7, 2];
for (let i = 0; i < tasks.length; i++) if (tasks[i] === 7) tasks.splice(i, 1);
console.log("5. forward splice of every 7:", tasks);

// 6. A Map-only LRU whose get() does not move the key: the key just read is evicted.
const lru = new Map<string, number>([["a", 1], ["b", 2]]);
lru.get("a"); // should make "a" the most recent
lru.delete(lru.keys().next().value!); // evicts "a", not "b"
lru.set("c", 3);
console.log("6. keys after reading a, then adding c:", [...lru.keys()]);
