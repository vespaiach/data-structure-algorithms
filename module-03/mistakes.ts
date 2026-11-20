// The wrong outputs from the "Common mistakes" section: node mistakes.ts

// 1. Counting with a plain object, when a key is also a name on Object.prototype.
const statuses = ["paid", "constructor", "paid", "toString"];
const counts: Record<string, number> = {};
for (const s of statuses) counts[s] = (counts[s] ?? 0) + 1;
console.log("1.", counts);
const fixed = new Map<string, number>();
for (const s of statuses) fixed.set(s, (fixed.get(s) ?? 0) + 1);
console.log("   Map:", fixed);

// 2. Expecting insertion order from an object with number-like keys.
const keys = ["30", "b", "10", "a", "2"];
const o: Record<string, number> = {};
const m = new Map<string, number>();
for (const k of keys) {
  o[k] = 1;
  m.set(k, 1);
}
console.log("2.", Object.keys(o), [...m.keys()]);

// 3. Objects and arrays as keys compare by identity, not by contents.
const seen = new Map<{ id: number }, number>();
seen.set({ id: 1 }, 1);
console.log("3.", seen.get({ id: 1 }), new Set([[1, 2], [1, 2]]).size, new Set(["1,2", "1,2"]).size);

// 4. Writing map[key] instead of map.set(key, value).
const wrong = new Map<string, number>();
(wrong as unknown as Record<string, number>)["paid"] = 1;
console.log("4.", wrong.size, wrong.get("paid"));

// 5. A composite key whose separator can appear inside the parts.
const key = (x: string, y: string) => `${x}-${y}`;
console.log("5.", key("a-b", "c") === key("a", "b-c"), JSON.stringify(["a-b", "c"]) === JSON.stringify(["a", "b-c"]));
