// Prints the state after each step of the module's traces (Figures 2, 4, 5, 6 and 9): node list-demo.ts
// Each loop below is the loop of the function named in its title, with a print added.
import { fromArray, type ListNode } from "./list.ts";
import type { Task } from "./opening-slow.ts";

const name = (n: ListNode<unknown> | null): string => (n === null ? "null" : String(n.value));
const label = (t: Task) => `${t.id}${t.done ? " done" : ""}`;

console.log("removeDoneList on tasks 0 done, 1, 2 done, 3");
{
  const head = fromArray([0, 1, 2, 3].map((id) => ({ id, done: id % 2 === 0 })));
  const dummy: ListNode<Task> = { value: { id: -1, done: false }, next: head };
  const show = (prev: ListNode<Task>) => {
    const parts: string[] = [];
    for (let n: ListNode<Task> | null = dummy; n !== null; n = n.next) {
      parts.push((n === dummy ? "[dummy]" : `[${label(n.value)}]`) + (n === prev ? "^" : ""));
    }
    return parts.join(" -> ");
  };
  let prev = dummy;
  let step = 0;
  while (prev.next !== null) {
    if (prev.next.value.done) prev.next = prev.next.next;
    else prev = prev.next;
    console.log(`  step ${++step}: ${show(prev)}`);
  }
}

console.log("\nreverseList on type, bold, delete");
{
  let prev: ListNode<string> | null = null;
  let node = fromArray(["type", "bold", "delete"]);
  let step = 0;
  while (node !== null) {
    const next = node.next;
    node.next = prev;
    prev = node;
    node = next;
    console.log(`  step ${++step}: prev ${name(prev)}, node ${name(node)}, prev.next ${name(prev.next)}`);
  }
}

for (const values of [[1, 2, 3, 4, 5], [1, 2, 3, 4]]) {
  console.log(`\nmiddleNode on ${values.join(", ")}`);
  let slow = fromArray(values);
  let fast = slow;
  console.log(`  start:  slow ${name(slow)}, fast ${name(fast)}`);
  let step = 0;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    console.log(`  step ${++step}: slow ${name(slow)}, fast ${name(fast)}`);
  }
}

console.log("\nFloyd on /old, /new, /login, /home, /promo, and /promo points back to /login");
{
  const head = fromArray(["/old", "/new", "/login", "/home", "/promo"])!;
  head.next!.next!.next!.next!.next = head.next!.next; // /promo -> /login
  let slow: ListNode<string> | null = head;
  let fast: ListNode<string> | null = head;
  let step = 0;
  console.log(`  phase 1 start:  slow ${name(slow)}, fast ${name(fast)}`);
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    console.log(`  phase 1 step ${++step}: slow ${name(slow)}, fast ${name(fast)}`);
    if (slow === fast) break;
  }
  let a: ListNode<string> | null = head;
  let b = slow;
  step = 0;
  console.log(`  phase 2 start:  a ${name(a)}, b ${name(b)}`);
  while (a !== b) {
    a = a!.next;
    b = b!.next;
    console.log(`  phase 2 step ${++step}: a ${name(a)}, b ${name(b)}`);
  }
}

console.log("\nTwo pointers 2 apart on boot, login, upload, logout, shutdown");
{
  const head = fromArray(["boot", "login", "upload", "logout", "shutdown"]);
  let lead = head;
  for (let i = 0; i < 2; i++) lead = lead!.next;
  let trail = head;
  console.log(`  start:  trail ${name(trail)}, lead ${name(lead)}`);
  let step = 0;
  while (lead !== null) {
    lead = lead.next;
    trail = trail!.next;
    console.log(`  step ${++step}: trail ${name(trail)}, lead ${name(lead)}`);
  }
}
