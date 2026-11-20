// Tests for the module's code: node --test heaps.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeScores, topTenSort } from "./opening-slow.ts";
import { topKHeap } from "./opening-fast.ts";
import { topKQuickselect, topTenTyped } from "./alternatives.ts";
import { dijkstraHeap, dijkstraScan, makeGraph, roads, type Graph } from "./dijkstra.ts";
import { RunningMedian, lastMedianSorted, mergeSorted } from "./variations.ts";

test("top k: every version matches the full sort", () => {
  for (const n of [0, 1, 9, 10, 11, 1000]) {
    const s = makeScores(n);
    const expected = topTenSort(s);
    assert.deepEqual(topKHeap(s), expected);
    assert.deepEqual(topKQuickselect(s), expected);
    assert.deepEqual(topTenTyped(s), expected);
  }
});

test("top k: k = 0, k larger than n, repeated scores, rising and falling input", () => {
  assert.deepEqual(topKHeap([3, 1, 2], 0), []);
  assert.deepEqual(topKHeap([3, 1, 2], 5), [3, 2, 1]);
  assert.deepEqual(topKHeap([7, 7, 7, 1, 7], 3), [7, 7, 7]);
  const up = Array.from({ length: 100 }, (_, i) => i);
  assert.deepEqual(topKHeap(up, 3), [99, 98, 97]);
  assert.deepEqual(topKHeap(up.toReversed(), 3), [99, 98, 97]);
});

test("Dijkstra: the small map, and both versions match Bellman-Ford on random graphs", () => {
  assert.deepEqual(Array.from(dijkstraHeap(roads, 0)), [0, 3, 1, 4, 7]);
  for (let trial = 0; trial < 30; trial++) {
    const g: Graph = makeGraph(50);
    if (trial % 3 === 0) for (const edges of g) for (const e of edges) e[1] = Math.floor(Math.random() * 3); // zero costs and ties
    const dist = new Array<number>(g.length).fill(Infinity);
    dist[0] = 0;
    for (let i = 0; i < g.length - 1; i++)
      for (let u = 0; u < g.length; u++) for (const [to, cost] of g[u]) dist[to] = Math.min(dist[to], dist[u] + cost);
    assert.deepEqual(Array.from(dijkstraHeap(g, 0)), dist);
    assert.deepEqual(Array.from(dijkstraScan(g, 0)), dist);
  }
});

test("Dijkstra: unreachable nodes stay at Infinity, one node alone", () => {
  const g: Graph = [[[1, 2]], [], [[0, 1]]];
  assert.deepEqual(Array.from(dijkstraHeap(g, 0)), [0, 2, Infinity]);
  assert.deepEqual(Array.from(dijkstraScan(g, 0)), [0, 2, Infinity]);
  assert.deepEqual(Array.from(dijkstraHeap([[]], 0)), [0]);
});

test("running median matches sorting, with ties and an empty start", () => {
  const rm = new RunningMedian();
  assert.equal(rm.median(), undefined);
  const xs: number[] = [];
  for (let i = 0; i < 500; i++) {
    const x = Math.floor(Math.random() * 20);
    rm.add(x);
    xs.push(x);
    assert.equal(rm.median(), lastMedianSorted(xs));
  }
});

test("merge k sorted lists matches a sort, with empty lists and repeats", () => {
  assert.deepEqual(mergeSorted([]), []);
  assert.deepEqual(mergeSorted([[], []]), []);
  assert.deepEqual(mergeSorted([[2, 2], [], [1, 2]]), [1, 2, 2, 2]);
  const lists = Array.from({ length: 50 }, () =>
    Array.from({ length: Math.floor(Math.random() * 40) }, () => Math.floor(Math.random() * 100)).sort((a, b) => a - b));
  assert.deepEqual(mergeSorted(lists), lists.flat().sort((a, b) => a - b));
});
