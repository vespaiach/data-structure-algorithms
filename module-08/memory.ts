// Bytes per heap entry: plain numbers against [distance, node] pairs, 1,000,000 entries each.
// node --expose-gc memory.ts
import { Heap } from "./heap.ts";

const gc = (globalThis as { gc?: () => void }).gc!;
const heapUsed = () => { gc(); return process.memoryUsage().heapUsed; };
const n = 1_000_000;

let before = heapUsed();
const smis = new Heap<number>((a, b) => a < b);
for (let i = 0; i < n; i++) smis.push(Math.floor(Math.random() * 1_000_000));
const smiBytes = heapUsed() - before;

before = heapUsed();
const doubles = new Heap<number>((a, b) => a < b);
for (let i = 0; i < n; i++) doubles.push(Math.random());
const doubleBytes = heapUsed() - before;

before = heapUsed();
const pairs = new Heap<[number, number]>((a, b) => a[0] < b[0]);
for (let i = 0; i < n; i++) pairs.push([Math.floor(Math.random() * 1_000_000), i]);
const pairBytes = heapUsed() - before;

const per = (bytes: number) => (bytes / n).toFixed(1).padStart(6) + " bytes per entry";
console.log("whole numbers   ", per(smiBytes));
console.log("fractions       ", per(doubleBytes));
console.log("[number, number]", per(pairBytes));
console.log("sizes kept alive:", smis.size, doubles.size, pairs.size);
