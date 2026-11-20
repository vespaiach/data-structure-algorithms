// The same two jobs on a linked list, and the plain-array answer (filter, head index).
import { bench } from "./bench.ts";
import { fromArray, type ListNode } from "./list.ts";
import { makeTasks, type Task } from "./opening-slow.ts";

// O(n): unlinking a node changes one pointer; a dummy head means the first node is not a special case.
export function removeDoneList(head: ListNode<Task> | null): ListNode<Task> | null {
  const dummy: ListNode<Task> = { value: { id: -1, done: false }, next: head };
  let prev = dummy;
  while (prev.next !== null) {
    if (prev.next.value.done) prev.next = prev.next.next; // unlink, do not move prev
    else prev = prev.next;
  }
  return dummy.next;
}

// O(n): taking the head is one pointer move.
export function drainList(head: ListNode<Task> | null): number {
  let sum = 0;
  while (head !== null) {
    sum += head.value.id;
    head = head.next;
  }
  return sum;
}

// O(n), and no list needed: build a new array of the tasks to keep.
export const removeDoneFilter = (tasks: Task[]): Task[] => tasks.filter((t) => !t.done);

// O(n): read from a moving index instead of removing.
export function drainIndex(tasks: Task[]): number {
  let sum = 0;
  for (let i = 0; i < tasks.length; i++) sum += tasks[i].id;
  return sum;
}

if (process.argv[1] === import.meta.filename) {
  const sizes = [25_000, 50_000, 100_000];
  const listOf = (n: number) => fromArray(makeTasks(n));
  bench("removeDone on a linked list", sizes, listOf, removeDoneList);
  bench("removeDone with filter", sizes, makeTasks, removeDoneFilter);
  bench("drainFront on a linked list", sizes, listOf, drainList);
  bench("drainFront with an index", sizes, makeTasks, drainIndex);
  const big = [1_000_000, 2_000_000, 4_000_000];
  bench("removeDone on a linked list (large)", big, listOf, removeDoneList);
  bench("removeDone with filter (large)", big, makeTasks, removeDoneFilter);
}
