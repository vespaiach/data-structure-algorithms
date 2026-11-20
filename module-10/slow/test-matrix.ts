// Exercise 1, slow answer: build every configuration, then drop the ones with a forbidden pair.
// Correct, but O(V^k * k * r): it builds all V^k configurations whatever the rules.
export type Setting = { name: string; values: string[] };

export function testMatrix(settings: Setting[], forbidden: [string, string][]): string[][] {
  let all: string[][] = [[]];
  for (const s of settings) all = all.flatMap((c) => s.values.map((v) => [...c, `${s.name}=${v}`]));
  return all.filter((c) => !forbidden.some(([a, b]) => c.includes(a) && c.includes(b)));
}
