// Packages and the packages they depend on, a builder for test inputs, and a checker.
export type Packages = Map<string, string[]>; // package name -> the names it depends on

// n packages. Package i depends on package i - 1 and on up to two random older packages,
// so the longest chain of dependencies is n packages long. The newest package comes first,
// as a lockfile sorted by release date might list them.
export function makePackages(n: number): Packages {
  const pkgs: Packages = new Map();
  for (let i = n - 1; i >= 0; i--) {
    const deps = new Set<string>();
    if (i > 0) deps.add(`pkg${i - 1}`);
    for (let k = 0; k < 2 && i > 1; k++) deps.add(`pkg${Math.floor(Math.random() * (i - 1))}`);
    pkgs.set(`pkg${i}`, [...deps]);
  }
  return pkgs;
}

// True when `order` lists every package once, and each one after all of its dependencies.
export function isValidOrder(pkgs: Packages, order: string[]): boolean {
  const pos = new Map(order.map((name, i) => [name, i]));
  if (order.length !== pkgs.size || pos.size !== pkgs.size) return false;
  for (const [name, deps] of pkgs) {
    const at = pos.get(name);
    if (at === undefined) return false;
    for (const d of deps) {
      const before = pos.get(d);
      if (before === undefined || before > at) return false;
    }
  }
  return true;
}
