// Cheapest paths from one node when edges have different costs: node dijkstra.ts
import { bench } from "./bench.ts";
import { Heap } from "./heap.ts";

export type Edge = [to: number, cost: number];
export type Graph = Edge[][]; // graph[v] = the edges out of node v

// V nodes, 4 one-way edges out of each to random nodes, costs 1 to 100.
export function makeGraph(V: number): Graph {
  return Array.from({ length: V }, () =>
    Array.from({ length: 4 }, (): Edge => [Math.floor(Math.random() * V), 1 + Math.floor(Math.random() * 100)]));
}

// Dijkstra's method as published in 1959: scan every node for the closest one not done yet.
// O(V^2 + E) time, O(V) memory.
export function dijkstraScan(graph: Graph, source: number): Float64Array {
  const V = graph.length;
  const dist = new Float64Array(V).fill(Infinity);
  const done = new Uint8Array(V);
  dist[source] = 0;
  for (let round = 0; round < V; round++) {
    let u = -1;
    for (let v = 0; v < V; v++) if (!done[v] && (u === -1 || dist[v] < dist[u])) u = v;
    if (dist[u] === Infinity) break; // every node left is unreachable
    done[u] = 1;
    for (const [to, cost] of graph[u]) if (dist[u] + cost < dist[to]) dist[to] = dist[u] + cost;
  }
  return dist;
}

// Dijkstra with a binary heap and lazy deletion: when a node's distance improves, push a new
// entry and leave the old one in the heap; skip an entry whose node is already done.
// O(E log V) time, O(V + E) memory (the heap can hold one entry per edge).
export function dijkstraHeap(graph: Graph, source: number): Float64Array {
  const dist = new Float64Array(graph.length).fill(Infinity);
  const done = new Uint8Array(graph.length);
  const heap = new Heap<[number, number]>((a, b) => a[0] < b[0]); // [distance, node]
  dist[source] = 0;
  heap.push([0, source]);
  while (heap.size > 0) {
    const [d, u] = heap.pop()!;
    if (done[u]) continue; // a stale entry: u was finished with a smaller distance
    done[u] = 1;
    for (const [to, cost] of graph[u]) {
      if (d + cost < dist[to]) {
        dist[to] = d + cost;
        heap.push([dist[to], to]);
      }
    }
  }
  return dist;
}

// The small road map of the module: 0 is the depot.
export const roads: Graph = [
  [[1, 4], [2, 1]], // 0 -> 1 costs 4, 0 -> 2 costs 1
  [[3, 1]], //         1 -> 3 costs 1
  [[1, 2], [3, 5]], // 2 -> 1 costs 2, 2 -> 3 costs 5
  [[4, 3]], //         3 -> 4 costs 3
  [],
];

if (process.argv[1] === import.meta.filename) {
  console.log("small map, scan:", dijkstraScan(roads, 0).join(" "), " heap:", dijkstraHeap(roads, 0).join(" "));
  const g = makeGraph(3_000);
  const a = dijkstraScan(g, 0), b = dijkstraHeap(g, 0);
  const reached = a.filter((x) => x < Infinity).length;
  console.log(`3,000 random nodes: same distances: ${a.every((x, i) => x === b[i])}, reached ${reached}`);
  const sizes = [4_000, 8_000, 16_000];
  bench("dijkstraScan", sizes, makeGraph, (gr) => dijkstraScan(gr, 0));
  bench("dijkstraHeap", sizes, makeGraph, (gr) => dijkstraHeap(gr, 0));
  bench("dijkstraHeap, larger", [100_000, 200_000, 400_000], makeGraph, (gr) => dijkstraHeap(gr, 0));
}
