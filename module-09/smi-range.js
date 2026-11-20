// Which numbers does V8 store as Smis in this Node.js build? node --allow-natives-syntax smi-range.js
// %HasSmiElements is true while an array holds only Smis (PACKED_SMI_ELEMENTS).
import { makeJob } from "./opening-slow.ts";

// One literal per line, not a loop over a list: the list would hold doubles (it has -2^31 - 1),
// and a whole number read from it would make [x] hold doubles too.
console.log(" 1073741823", %HasSmiElements([1073741823]) ? "Smi" : "not a Smi"); // 2^30 - 1
console.log(" 1073741824", %HasSmiElements([1073741824]) ? "Smi" : "not a Smi"); // 2^30
console.log(" 2147483647", %HasSmiElements([2147483647]) ? "Smi" : "not a Smi"); // 2^31 - 1
console.log(" 2147483648", %HasSmiElements([2147483648]) ? "Smi" : "not a Smi"); // 2^31
console.log("-2147483648", %HasSmiElements([-2147483648]) ? "Smi" : "not a Smi"); // -2^31
console.log("-2147483649", %HasSmiElements([-2147483649]) ? "Smi" : "not a Smi"); // -2^31 - 1
console.log("records with M = 2e9, Smi elements:", %HasSmiElements(makeJob(2e9).records));
console.log("records with M = 4e9, Smi elements:", %HasSmiElements(makeJob(4e9).records));
