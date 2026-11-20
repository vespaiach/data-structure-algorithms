// Which expected order IDs never arrived? Return them in the order of `expected`.
// Put the received IDs in a Set, then keep each expected ID the Set lacks.
// O(e + r) average time, O(r) extra memory.
// With ES2025 Set methods: [...new Set(expected).difference(new Set(received))]
// (runs on Node.js 22 and later), which also drops repeated expected IDs.
export function missingIds(expected: string[], received: string[]): string[] {
  const got = new Set(received);
  return expected.filter((id) => !got.has(id));
}
