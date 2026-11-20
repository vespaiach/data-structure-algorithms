// Exercise 2: every order in which the steps can run. Each rule [a, b] says that step a must run
// before step b, and rules name only steps in the list. Steps are distinct. Returns [] if no
// order follows every rule.
// Orderings with a prune: a step can be chosen only once every step it waits for is chosen.
// O(N * (n + r)) time for N nodes of the pruned tree, n steps and r rules (N is at most about
// e * n!). O(n + r) memory besides the output.
export function deployOrders(steps: string[], rules: [string, string][]): string[][] {
  const index = new Map(steps.map((s, i) => [s, i]));
  const waitsFor: number[][] = steps.map(() => []);
  for (const [a, b] of rules) waitsFor[index.get(b)!].push(index.get(a)!);
  const out: string[][] = [];
  const path: string[] = [];
  const used = new Array<boolean>(steps.length).fill(false);
  function explore(): void {
    if (path.length === steps.length) {
      out.push([...path]);
      return;
    }
    for (let i = 0; i < steps.length; i++) {
      if (used[i] || waitsFor[i].some((j) => !used[j])) continue; // prune: not ready yet
      used[i] = true; // choose
      path.push(steps[i]);
      explore(); // explore
      path.pop(); // undo both changes
      used[i] = false;
    }
  }
  explore();
  return out;
}
