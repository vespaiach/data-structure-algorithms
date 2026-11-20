// The common shapes of backtracking: subsets, orderings (permutations) and combinations: node shapes.ts

// Every subset, "loop from start" shape: every node of the tree is one subset.
// 2^n nodes, each copied (up to n items): O(2^n * n) time. O(n) memory besides the output.
export function subsets<T>(items: T[]): T[][] {
  const out: T[][] = [];
  const path: T[] = [];
  function explore(start: number): void {
    out.push([...path]); // every node is a subset
    for (let i = start; i < items.length; i++) {
      path.push(items[i]); // choose
      explore(i + 1); // explore
      path.pop(); // undo
    }
  }
  explore(0);
  return out;
}

// Every subset, "one level per item" shape: at level i, either take items[i] or skip it.
// 2^(n+1) - 1 nodes, and the 2^n leaves are the subsets. O(2^n * n) time, O(n) memory besides the output.
export function subsetsByChoice<T>(items: T[]): T[][] {
  const out: T[][] = [];
  const path: T[] = [];
  function explore(i: number): void {
    if (i === items.length) {
      out.push([...path]); // a leaf: every item has been decided
      return;
    }
    path.push(items[i]); // choice 1: take items[i]
    explore(i + 1);
    path.pop();
    explore(i + 1); // choice 2: skip it
  }
  explore(0);
  return out;
}

// Every order of the items (they are distinct). n! leaves, about e * n! nodes, and each node
// scans n flags: O(n * n!) time. O(n) memory besides the output.
export function orderings<T>(items: T[]): T[][] {
  const out: T[][] = [];
  const path: T[] = [];
  const used = new Array<boolean>(items.length).fill(false);
  function explore(): void {
    if (path.length === items.length) {
      out.push([...path]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue; // already in this order
      used[i] = true; // choose
      path.push(items[i]);
      explore(); // explore
      path.pop(); // undo both changes
      used[i] = false;
    }
  }
  explore();
  return out;
}

// Every group of exactly k items. C(n, k) leaves, each copied (k items): O(C(n, k) * k) for the output,
// and the prune keeps the tree close to that size. O(k) memory besides the output.
export function combinations<T>(items: T[], k: number): T[][] {
  const out: T[][] = [];
  const path: T[] = [];
  function explore(start: number): void {
    if (path.length === k) {
      out.push([...path]);
      return;
    }
    const need = k - path.length; // items still to choose
    for (let i = start; i <= items.length - need; i++) { // prune: leave room for the rest
      path.push(items[i]);
      explore(i + 1);
      path.pop();
    }
  }
  explore(0);
  return out;
}

if (process.argv[1] === import.meta.filename) {
  const show = (xs: string[][]) => xs.map((x) => x.join("") || "-").join(" ");
  console.log("subsets(abc):          ", show(subsets(["a", "b", "c"])));
  console.log("subsetsByChoice(abc):  ", show(subsetsByChoice(["a", "b", "c"])));
  console.log("orderings(abc):        ", show(orderings(["a", "b", "c"])));
  console.log("combinations(abcd, 2): ", show(combinations(["a", "b", "c", "d"], 2)));
}
