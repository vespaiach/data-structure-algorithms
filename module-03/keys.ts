// How Map and Set decide that two keys are equal: node keys.ts
console.log("new Set([NaN, NaN, 0, -0]).size ", new Set([NaN, NaN, 0, -0]).size);
console.log("[NaN].includes(NaN)             ", [NaN].includes(NaN));
console.log("[NaN].indexOf(NaN)              ", [NaN].indexOf(NaN));
console.log("Map with key 1, get('1')        ", new Map([[1, "number one"]]).get("1"));
console.log("Object.keys({ 1: 'one' })       ", Object.keys({ 1: "one" }));
const a = { id: 1 };
console.log("Set of a, has(a), has({ id: 1 })", new Set([a]).has(a), new Set([a]).has({ id: 1 }));
