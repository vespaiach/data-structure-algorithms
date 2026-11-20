// Summing a packed array and a holey one, each with its own copy of the loop.
import { bench } from "./bench.ts";

function sumPacked(a: number[]): number {
  let total = 0;
  for (let i = 0; i < a.length; i++) total += a[i];
  return total;
}
function sumHoley(a: number[]): number {
  let total = 0;
  for (let i = 0; i < a.length; i++) total += a[i];
  return total;
}

const packed = (n: number): number[] => {
  const a: number[] = [];
  for (let i = 0; i < n; i++) a.push(i);
  return a;
};
const holey = (n: number): number[] => {
  const a: number[] = new Array(n); // starts with n holes
  for (let i = 0; i < n; i++) a[i] = i;
  return a;
};

bench("sum a packed array", [1_000_000, 10_000_000], packed, sumPacked);
bench("sum a holey array", [1_000_000, 10_000_000], holey, sumHoley);
