// Prints the state of a ToyHashSet after each step: node hash-table-demo.ts
import { ToyHashSet, toyHash } from "./toy-hash-set.ts";

const set = new ToyHashSet();
const show = (title: string) => {
  console.log(`\n${title}`);
  console.log("  buckets", JSON.stringify(set.buckets));
  set.keys.forEach((k, i) => console.log(`  entry ${i}: ${k ?? "(deleted)"}, chain -> ${set.chain[i]}`));
};

for (const id of ["a7", "o2", "c9", "x1"]) {
  console.log(`toyHash("${id}") = ${toyHash(id)}, bucket ${set.bucketOf(id)} of ${set.buckets.length}`);
  set.add(id);
}
show("after a7, o2, c9, x1 (2 buckets, 4 entries: full)");

// Walk the chain for a key that is there and one that is not.
for (const id of ["a7", "b2"]) {
  const steps: string[] = [];
  for (let i = set.buckets[set.bucketOf(id)]; i !== -1; i = set.chain[i]) steps.push(`entry ${i} (${set.keys[i]})`);
  console.log(`has("${id}"): bucket ${set.bucketOf(id)}, compares ${steps.join(", ")} -> ${set.has(id)}`);
}

set.add("o3");
show("after o3 (the table was full, so it rehashed to 4 buckets first)");
for (const id of ["a7", "o2", "c9", "x1", "o3"]) console.log(`  ${id}: bucket ${set.bucketOf(id)} of 4`);

set.delete("o2");
show("after delete o2");
console.log("  in order:", [...set], "size", set.size);
