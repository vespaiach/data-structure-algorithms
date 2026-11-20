// Building a long string: += against push() and join(), then reading one character.
import { bench } from "./bench.ts";

const sizes = [100_000, 1_000_000, 10_000_000];
const line = (i: number) => `req ${i}\n`;

bench("+= in a loop", sizes, (n) => n, (n) => {
  let s = "";
  for (let i = 0; i < n; i++) s += line(i);
  return s;
});

bench("push() then join()", sizes, (n) => n, (n) => {
  const parts: string[] = [];
  for (let i = 0; i < n; i++) parts.push(line(i));
  return parts.join("");
});

// The first index read flattens the cons-string tree into one flat string: O(length) once.
const built = (n: number) => {
  let s = "";
  for (let i = 0; i < n; i++) s += line(i);
  return s;
};
bench("first s.charCodeAt(0) after += (flattens)", sizes, built, (s) => s.charCodeAt(0));
bench("charCodeAt(0) on a flat string", sizes, (n) => {
  const s = built(n);
  s.charCodeAt(0); // flatten while building the input, outside the timing
  return s;
}, (s) => s.charCodeAt(0));

// Reading a character after every += flattens the whole string on every pass: O(n^2).
bench("+= and read the last character on every pass", [2_000, 4_000, 8_000], (n) => n, (n) => {
  let s = "";
  let sum = 0;
  for (let i = 0; i < n; i++) {
    s += line(i);
    sum += s.charCodeAt(s.length - 1);
  }
  return sum + s.length;
});

// Prepending also builds cons strings, so it is no slower than appending.
bench("prepend: s = line + s", sizes, (n) => n, (n) => {
  let s = "";
  for (let i = 0; i < n; i++) s = line(i) + s;
  return s;
});
