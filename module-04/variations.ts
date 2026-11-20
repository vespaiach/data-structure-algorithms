// Building new lists with a dummy head and a tail pointer: node variations.ts
import { fromArray, toArray, type ListNode } from "./list.ts";
import type { Task } from "./opening-slow.ts";

// Split one list of tasks into the open ones and the done ones, keeping their order.
// Each output list has its own dummy head and a tail pointer, so appending is O(1)
// and the first append is not a special case. Relinks the nodes: O(n) time, O(1) extra memory.
export function splitByDone(head: ListNode<Task> | null): { open: ListNode<Task> | null; done: ListNode<Task> | null } {
  const openDummy: ListNode<Task> = { value: { id: -1, done: false }, next: null };
  const doneDummy: ListNode<Task> = { value: { id: -1, done: true }, next: null };
  let openTail = openDummy;
  let doneTail = doneDummy;
  for (let node = head; node !== null; node = node.next) {
    if (node.value.done) doneTail = doneTail.next = node;
    else openTail = openTail.next = node;
  }
  openTail.next = null; // the last node may still point into the other list
  doneTail.next = null;
  return { open: openDummy.next, done: doneDummy.next };
}

if (process.argv[1] === import.meta.filename) {
  const tasks = fromArray([0, 1, 2, 3, 4].map((id) => ({ id, done: id % 2 === 0 })));
  const { open, done } = splitByDone(tasks);
  console.log("open:", toArray(open).map((t) => t.id), " done:", toArray(done).map((t) => t.id));
}
