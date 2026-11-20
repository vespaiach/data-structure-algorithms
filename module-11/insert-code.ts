// Research only: copies the lab files into the module's ts code blocks, so the text and the folder
// match. A block is matched to the file whose first line equals the block's first line; when a stub
// and a solution share it, a block that says "not implemented" gets the stub.
// node insert-code.ts ../../../../posts/dsa-module-11/index.md
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const lab = import.meta.dirname;
const files = ["", "exercises", "solutions"].flatMap((dir) =>
  readdirSync(join(lab, dir))
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => join(dir, f)));
const firstLine = (s: string) => s.split("\n")[0];
const contents = new Map(files.map((f) => [f, readFileSync(join(lab, f), "utf8").trimEnd()]));

const page = process.argv[2];
let replaced = 0;
const out = readFileSync(page, "utf8").replace(/```ts\n([\s\S]*?)\n```/g, (block, body: string) => {
  const matches = files.filter((f) => firstLine(contents.get(f)!) === firstLine(body));
  if (matches.length === 0) throw new Error(`no lab file starts with: ${firstLine(body)}`);
  const stub = body.includes("not implemented");
  const pick = matches.length === 1 ? matches[0] : matches.find((f) => f.startsWith(stub ? "exercises" : "solutions"))!;
  replaced++;
  return "```ts\n" + contents.get(pick) + "\n```";
});
writeFileSync(page, out);
console.log(`${replaced} ts blocks replaced`);
