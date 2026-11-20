// Exercise 1: each setting has a name and its possible values. A configuration picks one value for
// every setting, in the order of the list, written as "name=value". `forbidden` lists pairs of
// "name=value" that must not appear in the same configuration. Returns every allowed configuration.
export type Setting = { name: string; values: string[] };

export function testMatrix(settings: Setting[], forbidden: [string, string][]): string[][] {
  throw new Error("not implemented");
}
