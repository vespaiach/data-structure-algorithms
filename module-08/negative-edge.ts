// Dijkstra finishes a node when it is the closest one left, assuming no later path can be shorter: node negative-edge.ts
import { dijkstraHeap, type Graph } from "./dijkstra.ts";

// 0 = depot, 1 = shop, 2 = hub, 3 = customer.
// 0->1 costs 2, 0->2 costs 3, 2->1 costs -2 (a rebate), 1->3 costs 1.
const graph: Graph = [[[1, 2], [2, 3]], [[3, 1]], [[1, -2]], []];
console.log("dijkstraHeap:", Array.from(dijkstraHeap(graph, 0)));

// Bellman-Ford (one line in the module): relax every edge V - 1 times. O(V * E).
const dist = graph.map(() => Infinity);
dist[0] = 0;
for (let i = 0; i < graph.length - 1; i++)
  for (let u = 0; u < graph.length; u++) for (const [to, cost] of graph[u]) dist[to] = Math.min(dist[to], dist[u] + cost);
console.log("Bellman-Ford:", dist);
