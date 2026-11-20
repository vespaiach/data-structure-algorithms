// A folder tree, and two builders for test inputs.
export type Folder = { name: string; size: number; children: Folder[] };

// A chain: each folder holds one subfolder, `depth` folders in all.
export function deepChain(depth: number): Folder {
  const root: Folder = { name: "f0", size: 1, children: [] };
  let cur = root;
  for (let i = 1; i < depth; i++) {
    const next: Folder = { name: `f${i}`, size: 1, children: [] };
    cur.children.push(next);
    cur = next;
  }
  return root;
}

// A wide tree of n folders: each folder has up to `fanout` subfolders, filled level by level.
export function wideTree(n: number, fanout = 4): Folder {
  const all: Folder[] = [{ name: "f0", size: 1, children: [] }];
  for (let i = 1; i < n; i++) {
    const f: Folder = { name: `f${i}`, size: 1, children: [] };
    all[Math.floor((i - 1) / fanout)].children.push(f);
    all.push(f);
  }
  return all[0];
}
