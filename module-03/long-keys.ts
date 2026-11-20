// Strings longer than 16,383 characters all hash to their length in V8.
// node long-keys.ts: n distinct strings of one length, differing in their first 8 characters.
import { bench } from "./bench.ts";

const strings = (length: number) => (n: number): string[] =>
  Array.from({ length: n }, (_, i) => String(i).padStart(8, "0") + "x".repeat(length - 8));

bench("new Set of n strings of length 16,383", [2_000, 4_000, 8_000], strings(16_383), (s) => new Set(s).size, 3);
bench("new Set of n strings of length 16,384", [2_000, 4_000, 8_000], strings(16_384), (s) => new Set(s).size, 3);
