// When V8 switches an object's properties to a hash table (dictionary mode).
// Plain JavaScript, because %HasFastProperties is a V8 debugging helper:
// node --allow-natives-syntax dictionary-mode.js
const o = {};
let i = 0;
while (%HasFastProperties(o)) {
  o["k" + i] = i; // a computed key, as in a dictionary
  i++;
}
console.log(`{} with computed keys: dictionary mode after key number ${i}`);

const literal = { a: 1, b: 2, c: 3 };
console.log("{ a, b, c }            fast:", %HasFastProperties(literal));
delete literal.a;
console.log("after delete .a        fast:", %HasFastProperties(literal));

