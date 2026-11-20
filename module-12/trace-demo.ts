// Prints Figures 3, 5 and 6 of the module from the real code: node trace-demo.ts
import assert from "node:assert/strict";
import { hasRunWithTotal } from "./opening.ts";
import { hasRunSlow } from "./method.ts";
import { Trie, type TrieNode } from "./trie.ts";

// Figure 3: hasRunSlow and hasRunWithTotal on one list, with every addition and every drop.
const minutes = [8, 3, 5, 9, 1];
const target = 15;
console.log(`total ${target}, minutes ${minutes.join(" ")}\n`);
console.log(`slow: every start, add until the sum reaches ${target}`);
let adds = 0;
let slowFound = false;
for (let start = 0; start < minutes.length && !slowFound; start++) {
  let sum = 0;
  let line = `start ${start}:`;
  for (let end = start; end < minutes.length && sum < target; end++) {
    sum += minutes[end];
    adds++;
    line += `  +${minutes[end]} = ${sum}`.padEnd(11);
    if (sum === target) slowFound = true;
  }
  console.log(line.trimEnd() + (slowFound ? "  found" : "  (over)"));
}
console.log(`${adds} additions\n`);
console.log(`window: add on the right, drop on the left while over ${target}`);
let sum = 0, left = 0, winAdds = 0, drops = 0, winFound = false;
for (let right = 0; right < minutes.length && !winFound; right++) {
  sum += minutes[right];
  winAdds++;
  let line = `right ${right}:  +${minutes[right]} = ${sum}`.padEnd(20);
  while (sum > target) {
    sum -= minutes[left++];
    drops++;
    line += `-${minutes[left - 1]} = ${sum}`;
  }
  if (sum === target) winFound = true;
  console.log((line.trimEnd() + (winFound ? "  found" : "")).trimEnd());
}
console.log(`${winAdds} additions, ${drops} drops\n`);
assert.equal(slowFound, hasRunSlow(minutes, target));
assert.equal(winFound, hasRunWithTotal(minutes, target));

// Figure 5: the trie of five commands. Each node is its character and the number of words that
// start with the prefix ending there; * marks the end of a word. A run of nodes with one child
// each is printed on one line.
const trie = new Trie();
const commands = ["deploy", "deploy-preview", "dev", "db-migrate", "db-seed"];
for (const c of commands) trie.add(c);
let nodes = 0;
function print(ch: string, node: TrieNode, indent: string): void {
  let line = "";
  for (;;) {
    nodes++;
    line += `${ch} ${node.count}${node.isWord ? " *" : ""}   `;
    if (node.children.size !== 1 || node.isWord) break;
    [[ch, node]] = node.children;
  }
  console.log(indent + line.trimEnd());
  for (const [c, child] of node.children) print(c, child, indent + "    ");
}
console.log(`root ${trie.root.count}`);
for (const [c, child] of trie.root.children) print(c, child, "    ");
const prefixes = new Set(commands.flatMap((c) => Array.from({ length: c.length }, (_, i) => c.slice(0, i + 1))));
assert.equal(nodes, prefixes.size); // one node per distinct prefix
console.log(`${nodes} nodes, one per distinct prefix; countWithPrefix("de") = ${trie.countWithPrefix("de")}`);

// Figure 6: the 32 bits that the bitwise operators see.
const bits = (x: number) => (x >>> 0).toString(2).padStart(32, "0").match(/.{8}/g)!.join(" ");
console.log();
for (const [label, x] of [["1 << 30", 1 << 30], ["1 << 31", 1 << 31], ["(1 << 31) >>> 0", (1 << 31) >>> 0], ["-1", -1], ["-1 >>> 1", -1 >>> 1]] as const)
  console.log(`${label.padEnd(16)}${bits(x)}   ${x}`);
