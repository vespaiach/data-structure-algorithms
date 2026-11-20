// Reading every value: an array, a list whose nodes were allocated in list order, and a list
// whose nodes are linked in a shuffled order (as in a list that changed many times).
import { bench } from "./bench.ts";
import type { ListNode } from "./list.ts";

const array = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// Allocates nodes 0, 1, 2, ... and links them in that order.
function inOrder(n: number): ListNode<number> {
  const nodes = Array.from({ length: n }, (_, i): ListNode<number> => ({ value: i, next: null }));
  for (let i = 0; i < n - 1; i++) nodes[i].next = nodes[i + 1];
  return nodes[0];
}
// Allocates nodes the same way, then links them in a random order.
function shuffled(n: number): ListNode<number> {
  const nodes = Array.from({ length: n }, (_, i): ListNode<number> => ({ value: i, next: null }));
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
  }
  for (let i = 0; i < n - 1; i++) nodes[i].next = nodes[i + 1];
  return nodes[0];
}
function sumArray(a: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i];
  return sum;
}
function sumList(head: ListNode<number> | null): number {
  let sum = 0;
  for (let node = head; node !== null; node = node.next) sum += node.value;
  return sum;
}

const sizes = [100_000, 1_000_000, 4_000_000];
bench("sum an array", sizes, array, sumArray);
bench("sum a list, nodes in allocation order", sizes, inOrder, sumList);
bench("sum a list, nodes linked in shuffled order", sizes, shuffled, sumList);
