// Counting orders per customer: a Map against a plain object used as a dictionary.
import { bench } from "./bench.ts";

// n customer names drawn from n / 10 distinct customers.
const names = (n: number): string[] =>
  Array.from({ length: n }, () => `cust-${Math.floor(Math.random() * (n / 10))}`);
const sizes = [100_000, 1_000_000, 4_000_000];

bench("count with a Map", sizes, names, (list) => {
  const counts = new Map<string, number>();
  for (const name of list) counts.set(name, (counts.get(name) ?? 0) + 1);
  return counts;
});

bench("count with an object", sizes, names, (list) => {
  const counts: Record<string, number> = {};
  for (const name of list) counts[name] = (counts[name] ?? 0) + 1;
  return counts;
});

// Removing keys: Map.delete against the delete operator on an object.
bench("add n/10 keys, then delete them all: Map", sizes, names, (list) => {
  const m = new Map<string, number>();
  for (const name of list) m.set(name, 1);
  for (const name of list) m.delete(name);
  return m;
});

bench("add n/10 keys, then delete them all: object", sizes, names, (list) => {
  const o: Record<string, number> = {};
  for (const name of list) o[name] = 1;
  for (const name of list) delete o[name];
  return o;
});
