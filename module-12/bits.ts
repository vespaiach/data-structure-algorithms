// Bitwise operators work on 32-bit integers (ECMAScript ToInt32 and ToUint32): node bits.ts

const show = (label: string, v: unknown) => console.log(label.padEnd(28), String(v));

show("5 & 3", 5 & 3);
show("5 | 3", 5 | 3);
show("5 ^ 3", 5 ^ 3);
show("~5", ~5);
show("1 << 30", 1 << 30);
show("1 << 31", 1 << 31); // sign bit: negative
show("(1 << 31) >>> 0", (1 << 31) >>> 0); // read the same 32 bits as unsigned
show("1 << 32", 1 << 32); // shift count is taken modulo 32
show("2 ** 32 | 0", 2 ** 32 | 0); // only the low 32 bits survive
show("(2 ** 32 + 5) | 0", (2 ** 32 + 5) | 0);
show("3.9 | 0", 3.9 | 0); // truncates toward zero
show("-3.9 | 0", -3.9 | 0);
show("-1 >> 1", -1 >> 1); // sign-extending
show("-1 >>> 1", -1 >>> 1); // zero-filling
show("-1 >>> 0", -1 >>> 0);
show("Number.MAX_SAFE_INTEGER | 0", Number.MAX_SAFE_INTEGER | 0);

// BigInt: no 32-bit limit, but no >>> and no mixing with Number.
show("1n << 40n", 1n << 40n);
show("(1n << 64n) - 1n", (1n << 64n) - 1n);
show("BigInt.asUintN(64, -1n)", BigInt.asUintN(64, -1n));
try {
  // @ts-ignore: deliberate, to show the runtime error
  console.log(1n >>> 1n);
} catch (e) {
  show("1n >>> 1n", `${(e as Error).constructor.name}: ${(e as Error).message}`);
}

// Subset masks: bit i set means item i is in the subset. Works for n <= 30 with Number.
const items = ["sso", "audit", "backup"];
for (let mask = 0; mask < 1 << items.length; mask++) {
  const picked = items.filter((_, i) => (mask & (1 << i)) !== 0);
  console.log(mask.toString(2).padStart(3, "0"), JSON.stringify(picked));
}

// Mistake: precedence. === binds tighter than &, so this is mask & ((1 << i) === 1).
const mask = 0b110;
for (let i = 0; i < 3; i++) {
  // @ts-ignore: deliberate, TypeScript would reject number & boolean
  const wrong = mask & (1 << i) === 1 ? "in" : "out";
  const right = (mask & (1 << i)) !== 0 ? "in" : "out";
  console.log(`bit ${i} of 0b110: wrong test says ${wrong}, right test says ${right}`);
}

// Mistake: a loop bound of 1 << n for n = 31 or 32.
for (const n of [30, 31, 32]) console.log(`n=${n}: 1 << n = ${1 << n}, loop runs ${Math.max(0, 1 << n)} times; 2 ** n = ${2 ** n}`);
