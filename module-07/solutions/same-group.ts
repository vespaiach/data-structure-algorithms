import { Deque } from "../deque.ts";

// Exercise 1: servers 0 to n - 1 and two-way links between them. For each pair [a, b],
// true when a can reach b through the links.
// Breadth first from every server not labelled yet, giving the whole group one number; then each
// question compares two numbers. O(V + E + Q) time for Q questions, O(V + E) memory.
export function sameGroup(n: number, links: [number, number][], pairs: [number, number][]): boolean[] {
  const neighbours: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of links) {
    neighbours[a].push(b);
    neighbours[b].push(a);
  }
  const group = new Int32Array(n).fill(-1); // -1: not labelled yet, so also the visited set
  const queue = new Deque<number>();
  let groups = 0;
  for (let start = 0; start < n; start++) {
    if (group[start] !== -1) continue;
    group[start] = groups;
    queue.push(start);
    while (queue.size > 0) {
      for (const next of neighbours[queue.shift()!]) {
        if (group[next] !== -1) continue;
        group[next] = groups;
        queue.push(next);
      }
    }
    groups++;
  }
  return pairs.map(([a, b]) => group[a] === group[b]);
}
