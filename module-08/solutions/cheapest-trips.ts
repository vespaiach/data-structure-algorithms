// Exercise 4: `out` and `back` are flight prices, each sorted from cheapest. A trip is one
// outbound flight and one return flight. Returns the k lowest trip prices, cheapest first.
// out[i] + back[0], out[i] + back[1], ... is a sorted list for each i, so merge those lists with a
// heap, as mergeSorted does. Only the first min(k, out.length) lists can matter.
// O(k log k) time, O(k) extra memory besides the output.
import { Heap } from "../heap.ts";

export function cheapestTrips(out: number[], back: number[], k: number): number[] {
  const result: number[] = [];
  if (back.length === 0) return result;
  const first: [number, number, number][] = []; // [price, i, j]
  for (let i = 0; i < Math.min(k, out.length); i++) first.push([out[i] + back[0], i, 0]);
  const heap = new Heap<[number, number, number]>((a, b) => a[0] < b[0], first);
  while (result.length < k && heap.size > 0) {
    const [price, i, j] = heap.peek()!;
    result.push(price);
    if (j + 1 < back.length) heap.replaceTop([out[i] + back[j + 1], i, j + 1]); // the next trip in list i
    else heap.pop();
  }
  return result;
}
