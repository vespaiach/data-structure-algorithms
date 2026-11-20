// Prints the state after each step of the module's traces: node trace-demo.ts
// The loops for nextSlower and windowMax are the loops of those functions, with a print added.
import assert from "node:assert/strict";
import { Deque } from "./deque.ts";
import { IndexQueue } from "./index-queue.ts";
import { nextSlower } from "./next-slower.ts";
import { windowMax } from "./window-max.ts";

// Private fields are plain properties at run time, so the demo can print them.
const peek = (o: object, key: string) => (o as Record<string, unknown>)[key];

console.log("spanDurations: the stack of open spans after each event");
{
  const events = ["start request", "start db", "end db", "start render", "end render", "end request"];
  const open: string[] = [];
  for (const e of events) {
    const [kind, name] = e.split(" ");
    if (kind === "start") open.push(name);
    else open.pop();
    console.log(`  ${e.padEnd(14)} [${open.join(", ")}]`);
  }
}

console.log("\nIndexQueue: push a, b, c, then shift twice, then push d");
{
  const q = new IndexQueue<string>();
  const show = (op: string) =>
    console.log(`  ${op.padEnd(12)} items ${JSON.stringify(peek(q, "items"))}  head ${peek(q, "head")}  size ${q.size}`);
  for (const x of ["a", "b", "c"]) q.push(x);
  show("push a, b, c");
  show(`shift -> ${q.shift()}`);
  show(`shift -> ${q.shift()}`);
  q.push("d");
  show("push d");
}

console.log("\nDeque(4) used as a queue");
{
  const d = new Deque<string>(4);
  const show = (op: string) =>
    console.log(`  ${op.padEnd(12)} buf ${JSON.stringify(peek(d, "buf"))}  head ${peek(d, "head")}  count ${d.size}`);
  for (const x of ["a", "b", "c"]) d.push(x);
  show("push a, b, c");
  show(`shift -> ${d.shift()}`);
  show(`shift -> ${d.shift()}`);
  for (const x of ["d", "e", "f"]) {
    d.push(x);
    show(`push ${x}`);
  }
  d.push("g");
  show("push g");
}

console.log("\nnextSlower([120, 80, 95, 300, 90, 90, 150])");
{
  const ms = [120, 80, 95, 300, 90, 90, 150];
  const result = new Array<number>(ms.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < ms.length; i++) {
    const popped: number[] = [];
    while (stack.length > 0 && ms[stack[stack.length - 1]] < ms[i]) {
      const j = stack.pop()!;
      result[j] = i;
      popped.push(j);
    }
    stack.push(i);
    const pops = popped.length ? `pop ${popped.join(", ")} (answer ${i})` : "";
    console.log(`  i ${i} (${ms[i]})  ${pops.padEnd(22)} stack [${stack.join(", ")}]`);
  }
  console.log(`  result ${JSON.stringify(result)}`);
  assert.deepEqual(result, nextSlower(ms));
}

console.log("\nwindowMax([30, 10, 50, 20, 20, 40, 10], 3)");
{
  const samples = [30, 10, 50, 20, 20, 40, 10];
  const k = 3;
  const out: number[] = [];
  const dq = new Deque<number>();
  for (let i = 0; i < samples.length; i++) {
    const popped: number[] = [];
    while (dq.size > 0 && samples[dq.peekBack()!] <= samples[i]) popped.push(dq.pop()!);
    dq.push(i);
    let left = "";
    if (dq.peekFront()! <= i - k) left = `shift ${dq.shift()}`;
    if (i >= k - 1) out.push(samples[dq.peekFront()!]);
    const items: number[] = [];
    for (let n = dq.size; n > 0; n--) {
      const x = dq.shift()!;
      items.push(x);
      dq.push(x);
    }
    const pops = popped.length ? `pop ${popped.join(", ")}` : "";
    const max = i >= k - 1 ? `max ${out.at(-1)}` : "";
    console.log(`  i ${i} (${samples[i]})  ${pops.padEnd(10)} ${left.padEnd(8)} deque [${items.join(", ")}]  ${max}`);
  }
  assert.deepEqual(out, windowMax(samples, k));
}
