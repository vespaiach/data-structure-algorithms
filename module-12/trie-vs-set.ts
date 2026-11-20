// A trie against a Set of the same words: the memory each holds, and counting the words that start
// with a prefix. node --expose-gc trie-vs-set.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";
import { Trie } from "./trie.ts";

const letters = "abcdefghijklmnopqrstuvwxyz";
const pick = <T>(xs: readonly T[] | string) => xs[Math.floor(Math.random() * xs.length)];

// Words that share few prefixes: 8 random letters.
const randomWords = (n: number) => Array.from({ length: n }, () => Array.from({ length: 8 }, () => pick(letters)).join(""));
// Words that share long prefixes: URL paths.
const urlPaths = (n: number) =>
  Array.from({ length: n }, () => `/api/v1/${pick(["users", "orders", "teams"])}/${100_000 + Math.floor(Math.random() * 900_000)}/${pick(["items", "notes"])}`);

const gc = (globalThis as { gc?: () => void }).gc;
if (gc === undefined) throw new Error("run with node --expose-gc trie-vs-set.ts");

// The heap that build() leaves behind, with a garbage collection before each reading.
function heapOf<T>(build: () => T): { mb: number; kept: T } {
  gc!();
  const before = process.memoryUsage().heapUsed;
  const kept = build();
  gc!();
  return { mb: (process.memoryUsage().heapUsed - before) / 1024 / 1024, kept };
}

function countNodes(t: Trie): number {
  let nodes = 0;
  const stack = [t.root];
  while (stack.length > 0) {
    nodes++;
    for (const child of stack.pop()!.children.values()) stack.push(child);
  }
  return nodes;
}

const sinks: unknown[] = [];
for (const [label, make] of [["8 random letters", randomWords], ["URL paths", urlPaths]] as const) {
  // The Set's reading includes its strings; the trie's does not need them once it's built.
  const set = heapOf(() => new Set(make(100_000)));
  const words = [...set.kept];
  const trie = heapOf(() => {
    const t = new Trie();
    for (const w of words) t.add(w);
    return t;
  });
  const chars = words.reduce((s, w) => s + w.length, 0);
  const nodes = countNodes(trie.kept);
  console.log(`${label}: ${words.length.toLocaleString("en-US")} words, ${chars.toLocaleString("en-US")} characters`);
  console.log(`  Set with its strings ${set.mb.toFixed(1)} MB; trie ${trie.mb.toFixed(1)} MB, ${nodes.toLocaleString("en-US")} nodes, ${((trie.mb * 1024 * 1024) / nodes).toFixed(0)} bytes per node`);
  sinks.push(set.kept, trie.kept);
}
sinks.length = 0;

// 100 prefix counts: scan a Set of the words, or walk a trie of them. Each input holds only its own structure.
const prefixes = Array.from({ length: 100 }, () => pick(letters) + pick(letters));
const scan = (set: Set<string>) => {
  let c = 0;
  for (const p of prefixes) for (const w of set) if (w.startsWith(p)) c++;
  return c;
};
const walk = (trie: Trie) => {
  let c = 0;
  for (const p of prefixes) c += trie.countWithPrefix(p);
  return c;
};
const makeTrie = (n: number) => {
  const t = new Trie();
  for (const w of randomWords(n)) t.add(w);
  return t;
};

const words = randomWords(10_000);
const check = new Trie();
for (const w of words) check.add(w);
assert.equal(walk(check), scan(new Set(words)));
console.log("\nsame counts for 100 prefixes on 10,000 words: true");

let sink = 0;
const sizes = [10_000, 100_000, 1_000_000];
bench("100 prefix counts, scanning a Set", sizes, (n) => new Set(randomWords(n)), (s) => (sink += scan(s)), 3);
bench("100 prefix counts, walking a trie", sizes, makeTrie, (t) => (sink += walk(t)), 3);
if (sink === 0) console.log(sink);
