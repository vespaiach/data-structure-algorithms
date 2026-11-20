// Which elements kind V8 uses for an array. Plain JavaScript, because the %
// functions are V8 debugging helpers, not TypeScript: node --allow-natives-syntax elements-kinds.js
function kind(a) {
  if (%HasDictionaryElements(a)) return "DICTIONARY_ELEMENTS";
  const type = %HasSmiElements(a) ? "SMI_" : %HasDoubleElements(a) ? "DOUBLE_" : "";
  return (%HasHoleyElements(a) ? "HOLEY_" : "PACKED_") + type + "ELEMENTS";
}

const a = [1, 2, 3];
console.log("[1, 2, 3]                   ", kind(a));
a.push(4.5);
console.log("after push(4.5)             ", kind(a));
a.push("x");
console.log("after push('x')             ", kind(a));
a.pop();
a.pop();
console.log("after pop() twice           ", kind(a));

const b = new Array(3);
console.log("new Array(3)                ", kind(b));
b[0] = 1; b[1] = 2; b[2] = 3;
console.log("...then b[0..2] = 1, 2, 3   ", kind(b));
console.log("Array.from({ length: 3 }, f)", kind(Array.from({ length: 3 }, (_, i) => i)));
console.log("new Array(3).fill(0)        ", kind(new Array(3).fill(0)));

const c = [1, 2, 3];
c[5] = 6;
console.log("[1, 2, 3] then c[5] = 6     ", kind(c));
const d = [];
d[1024] = 1;
console.log("[] then d[1024] = 1         ", kind(d));
