import { Deque } from "../deque.ts";

// A correct but slow answer to Exercise 1: a new breadth-first search for every question,
// which walks up to a whole group each time. O(Q * (V + E)) time.
export function sameGroup(n: number, links: [number, number][], pairs: [number, number][]): boolean[] {
  const neighbours: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of links) {
    neighbours[a].push(b);
    neighbours[b].push(a);
  }
  return pairs.map(([a, b]) => {
    const seen = new Set<number>([a]);
    const queue = new Deque<number>();
    queue.push(a);
    while (queue.size > 0) {
      const server = queue.shift()!;
      if (server === b) return true;
      for (const next of neighbours[server]) {
        if (seen.has(next)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
    return false;
  });
}
