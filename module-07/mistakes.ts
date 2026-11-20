// Common mistakes with graph search, and the wrong output each one gives: node mistakes.ts
import type { Packages } from "./packages.ts";

// 1. No visited set on a graph with a cycle: the walk goes around the cycle forever.
// (Stopped after 20 steps here so the script ends.)
{
  const links: Packages = new Map([["a", ["b"]], ["b", ["c"]], ["c", ["a"]]]);
  const walked: string[] = [];
  const stack = ["a"];
  while (stack.length > 0 && walked.length < 20) {
    const node = stack.pop()!;
    walked.push(node);
    for (const next of links.get(node)!) stack.push(next); // never checks "seen"
  }
  console.log("1. no visited set:", walked.join(" "));
}

// 2. Marking a cell visited when it is taken out of the queue, not when it is put in:
// the same cell is queued many times. Count the pushes on an open 30 x 30 floor (900 cells).
function countPushes(side: number, markOnPush: boolean): number {
  const seen = new Uint8Array(side * side);
  const queue: number[] = [0]; // read with a head index, never shift()
  if (markOnPush) seen[0] = 1;
  let pushes = 1;
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head];
    if (!markOnPush) {
      if (seen[cell]) continue;
      seen[cell] = 1;
    }
    const r = Math.floor(cell / side), c = cell % side;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (nr < 0 || nc < 0 || nr >= side || nc >= side) continue;
      const next = nr * side + nc;
      if (seen[next]) continue;
      if (markOnPush) seen[next] = 1;
      queue.push(next);
      pushes++;
    }
  }
  return pushes;
}
console.log("2. pushes on 900 cells, mark on push:", countPushes(30, true), " mark on pop:", countPushes(30, false));

// 3. Kahn's algorithm without the final length check and without checking names:
// a cycle, or a dependency missing from the list, quietly gives a short order.
function kahnNoCheck(pkgs: Packages): string[] {
  const dependents = new Map<string, string[]>();
  const waiting = new Map<string, number>();
  for (const [name, deps] of pkgs) {
    waiting.set(name, deps.length);
    for (const d of deps) dependents.getOrInsertComputed(d, () => []).push(name);
  }
  const order: string[] = [];
  for (const [name, count] of waiting) if (count === 0) order.push(name);
  for (let head = 0; head < order.length; head++) {
    for (const next of dependents.get(order[head]) ?? []) {
      const left = waiting.get(next)! - 1;
      waiting.set(next, left);
      if (left === 0) order.push(next);
    }
  }
  return order; // missing: if (order.length < pkgs.size) throw ...
}
const withCycle: Packages = new Map([["app", ["ui", "api"]], ["ui", ["core"]], ["api", ["auth"]], ["auth", ["api"]], ["core", []]]);
const short = kahnNoCheck(withCycle);
console.log("3. order with a cycle:", short.join(" "), `(${withCycle.size} packages)`);
console.log("3. never built:", [...new Set(withCycle.keys()).difference(new Set(short))].join(" "));
const unlisted: Packages = new Map([["app", ["lib"]], ["cli", []]]);
console.log("3. order with a dependency not in the list:", kahnNoCheck(unlisted).join(" "), `(${unlisted.size} packages)`);

// 4. A two-way link stored in one direction only: the walk from 0 never reaches 1.
function countGroupsOneWay(n: number, links: [number, number][]): number {
  const neighbours: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of links) neighbours[a].push(b); // missing: neighbours[b].push(a)
  const seen = new Uint8Array(n);
  let groups = 0;
  for (let start = 0; start < n; start++) {
    if (seen[start]) continue;
    groups++;
    seen[start] = 1;
    const queue = [start];
    for (let head = 0; head < queue.length; head++) {
      for (const next of neighbours[queue[head]]) {
        if (!seen[next]) {
          seen[next] = 1;
          queue.push(next);
        }
      }
    }
  }
  return groups;
}
console.log("4. groups for links 1-0 and 1-2, one direction only:", countGroupsOneWay(3, [[1, 0], [1, 2]]), "(want 1)");

// 5. Depth first for fewest steps: the first time a depth-first walk reaches the goal is
// by whatever path it tried first, not the shortest one. Open 5 x 5 floor, corner to corner.
function stepsDepthFirst(side: number): number {
  const dist = new Int32Array(side * side).fill(-1);
  const stack = [0];
  dist[0] = 0;
  while (stack.length > 0) {
    const cell = stack.pop()!;
    if (cell === side * side - 1) return dist[cell];
    const r = Math.floor(cell / side), c = cell % side;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (nr < 0 || nc < 0 || nr >= side || nc >= side || dist[nr * side + nc] !== -1) continue;
      dist[nr * side + nc] = dist[cell] + 1;
      stack.push(nr * side + nc);
    }
  }
  return -1;
}
console.log("5. depth first on an open 5 x 5 floor:", stepsDepthFirst(5), "steps (fewest: 8)");
