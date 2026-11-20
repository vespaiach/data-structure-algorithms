// Exercise 1: each setting has a name and its possible values. A configuration picks one value for
// every setting, in the order of the list, written as "name=value". `forbidden` lists pairs of
// "name=value" that must not appear in the same configuration. Returns every allowed configuration.
export type Setting = { name: string; values: string[] };

// One level per setting, one branch per value. A value that forms a forbidden pair with a value
// already chosen ends its branch. O(N * k * r) time for N nodes, k settings and r rules per value
// (N is at most the 1 + V + V^2 + ... + V^k of the full tree for V values per setting).
// O(k) memory besides the output and the rule map.
export function testMatrix(settings: Setting[], forbidden: [string, string][]): string[][] {
  const clashes = new Map<string, string[]>(); // "name=value" -> the values it must not meet
  for (const [a, b] of forbidden) {
    clashes.set(a, [...(clashes.get(a) ?? []), b]);
    clashes.set(b, [...(clashes.get(b) ?? []), a]);
  }
  const out: string[][] = [];
  const path: string[] = [];
  function explore(i: number): void {
    if (i === settings.length) {
      out.push([...path]);
      return;
    }
    for (const v of settings[i].values) {
      const choice = `${settings[i].name}=${v}`;
      if ((clashes.get(choice) ?? []).some((c) => path.includes(c))) continue; // prune
      path.push(choice); // choose
      explore(i + 1); // explore
      path.pop(); // undo
    }
  }
  explore(0);
  return out;
}
