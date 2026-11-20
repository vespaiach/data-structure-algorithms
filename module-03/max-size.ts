// How many entries a Map and a Set can hold in V8: node max-size.ts
// Uses about 900 MB of memory.
for (const make of [() => new Map<number, number>(), () => new Set<number>()]) {
  const c = make();
  let i = 0;
  try {
    for (; ; i++) c instanceof Map ? c.set(i, i) : c.add(i);
  } catch (e) {
    console.log(`${c.constructor.name} stopped at ${i.toLocaleString("en-US")}: ${e}`);
  }
}
