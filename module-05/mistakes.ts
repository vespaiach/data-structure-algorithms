// Common mistakes with stacks, queues and deques, and the wrong output each one gives. node mistakes.ts
import type { SpanEvent } from "./spans.ts";

// 1. Using pop() for a queue: the newest job runs first.
const jobs = ["first", "second", "third"];
const order: string[] = [];
while (jobs.length > 0) order.push(jobs.pop()!);
console.log("1. queue drained with pop():", order);

// 2. Growing a full ring buffer by copying the array as it is, and keeping head.
// The buffer below is full: head = 2, so the queue is c, d, e, f.
function growBad(buf: string[], head: number, count: number): (string | undefined)[] {
  const next = [...buf, ...new Array<string | undefined>(buf.length)]; // same positions, twice the size
  const out: (string | undefined)[] = [];
  for (let i = 0; i < count; i++) out.push(next[(head + i) & (next.length - 1)]);
  return out;
}
console.log("2. queue after a naive grow:", growBad(["e", "f", "c", "d"], 2, 4), "(want [ 'c', 'd', 'e', 'f' ])");

// 3. Spans without the check at the end: a span that never ends passes.
function spansBad(events: SpanEvent[]): number {
  const open: SpanEvent[] = [];
  let closed = 0;
  for (const e of events) {
    if (e.kind === "start") open.push(e);
    else if (open.pop()?.name !== e.name) throw new Error(`end ${e.name} does not match`);
    else closed++;
  }
  return closed; // open.length is never checked
}
const unclosed: SpanEvent[] = [{ kind: "start", name: "request", t: 0 }, { kind: "start", name: "db", t: 1 }, { kind: "end", name: "db", t: 5 }];
console.log("3. spans closed, with request never ended:", spansBad(unclosed), "(want an error)");

// 4. Monotonic stack with <= instead of <: an equal time counts as slower.
function nextSlowerBad(ms: number[]): number[] {
  const result = new Array<number>(ms.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < ms.length; i++) {
    while (stack.length > 0 && ms[stack[stack.length - 1]] <= ms[i]) result[stack.pop()!] = i;
    stack.push(i);
  }
  return result;
}
console.log("4. next slower of [50, 50, 60]:", nextSlowerBad([50, 50, 60]), "(want [ 2, 2, -1 ])");

// 5. Window maximum that never drops the front index when it leaves the window.
function windowMaxBad(samples: number[], k: number): number[] {
  const dq: number[] = [];
  const out: number[] = [];
  for (let i = 0; i < samples.length; i++) {
    while (dq.length > 0 && samples[dq[dq.length - 1]] <= samples[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(samples[dq[0]]);
  }
  return out;
}
console.log("5. window max of [9, 1, 2, 3], k = 2:", windowMaxBad([9, 1, 2, 3], 2), "(want [ 9, 2, 3 ])");

// 6. A head-index queue that never drops the used front: the array only grows.
const items: (number | undefined)[] = [];
let head = 0;
for (let i = 0; i < 10; i++) items.push(i);
for (let i = 0; i < 1_000_000; i++) {
  items[head++] = undefined; // shift
  items.push(i); // push
}
console.log("6. array length with 10 jobs waiting, after 1,000,000 rounds:", items.length.toLocaleString("en-US"));
