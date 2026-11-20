// Common backtracking bugs and the wrong output each one prints: node mistakes.ts
const show = (xs: string[][]) => xs.map((x) => x.join("") || "-").join(" ");

// 1. No undo: the path keeps the items of the branch before.
function subsetsNoPop(items: string[]): string[][] {
  const out: string[][] = [];
  const path: string[] = [];
  function explore(start: number): void {
    out.push([...path]);
    for (let i = start; i < items.length; i++) {
      path.push(items[i]);
      explore(i + 1); // missing: path.pop()
    }
  }
  explore(0);
  return out;
}
console.log("1. no pop:          ", show(subsetsNoPop(["a", "b", "c"])));

// 2. No copy: every entry of out is the same array, which is empty at the end.
function subsetsNoCopy(items: string[]): string[][] {
  const out: string[][] = [];
  const path: string[] = [];
  function explore(start: number): void {
    out.push(path); // missing: [...path]
    for (let i = start; i < items.length; i++) {
      path.push(items[i]);
      explore(i + 1);
      path.pop();
    }
  }
  explore(0);
  return out;
}
console.log("2. no copy:         ", JSON.stringify(subsetsNoCopy(["a", "b", "c"])));

// 3. A used flag that is set but never cleared: only the first order is found.
function orderingsNoClear(items: string[]): string[][] {
  const out: string[][] = [];
  const path: string[] = [];
  const used = new Array<boolean>(items.length).fill(false);
  function explore(): void {
    if (path.length === items.length) {
      out.push([...path]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(items[i]);
      explore();
      path.pop(); // missing: used[i] = false
    }
  }
  explore();
  return out;
}
console.log("3. flag not cleared:", show(orderingsNoClear(["a", "b", "c"])));

// 4. The loop starts at 0 instead of start: every subset appears in every order.
function subsetsFromZero(items: string[]): string[][] {
  const out: string[][] = [];
  const path: string[] = [];
  const used = new Array<boolean>(items.length).fill(false);
  function explore(): void {
    out.push([...path]);
    for (let i = 0; i < items.length; i++) { // should be: i = start
      if (used[i]) continue;
      used[i] = true;
      path.push(items[i]);
      explore();
      path.pop();
      used[i] = false;
    }
  }
  explore();
  return out;
}
console.log("4. loop from 0:     ", show(subsetsFromZero(["a", "b", "c"])), `(${subsetsFromZero(["a", "b", "c"]).length} results, not 8)`);

// 5. break on a list that is not sorted: stops at 500 and never sees 200.
function costsUnderBreak(costs: number[], budget: number): number[][] {
  const out: number[][] = [];
  const path: number[] = [];
  function explore(start: number, left: number): void {
    for (let i = start; i < costs.length; i++) {
      if (costs[i] > left) break; // only safe when costs is sorted
      path.push(costs[i]);
      out.push([...path]);
      explore(i + 1, left - costs[i]);
      path.pop();
    }
  }
  explore(0, budget);
  return out;
}
console.log("5. break, [300, 500, 200], budget 500:", JSON.stringify(costsUnderBreak([300, 500, 200], 500)));
console.log("   break, [200, 300, 500], budget 500:", JSON.stringify(costsUnderBreak([200, 300, 500], 500)));

// 6. Equal items in the input: the same subset comes out more than once.
// The fix: sort, then skip an item equal to the one before it at the same level.
function subsetsOf(items: string[], skipEqual: boolean): string[][] {
  const sorted = items.toSorted();
  const out: string[][] = [];
  const path: string[] = [];
  function explore(start: number): void {
    out.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      if (skipEqual && i > start && sorted[i] === sorted[i - 1]) continue; // same choice as the last branch
      path.push(sorted[i]);
      explore(i + 1);
      path.pop();
    }
  }
  explore(0);
  return out;
}
console.log("6. equal items, xxy:", show(subsetsOf(["x", "y", "x"], false)));
console.log("   skip equal:      ", show(subsetsOf(["x", "y", "x"], true)));
