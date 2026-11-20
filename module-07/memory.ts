// Memory of an adjacency matrix against adjacency lists for the same sparse
// graph: V nodes, about 3 edges per node. One V per process, so nothing from
// an earlier size is still on the heap:
//   for V in 1000 10000 20000; do node --expose-gc memory.ts $V; done
const gc = (globalThis as { gc?: () => void }).gc!;
const heapUsed = () => { gc(); return process.memoryUsage().heapUsed; }; // lists live on the JS heap
const mb = (bytes: number) => (bytes / 2 ** 20).toFixed(1) + " MB";

const V = Number(process.argv[2]);
const edges: [number, number][] = [];
for (let v = 1; v < V; v++) for (let k = 0; k < 3; k++) edges.push([v, Math.floor(Math.random() * v)]);

const before = heapUsed();
const lists: number[][] = Array.from({ length: V }, () => []); // O(V + E) memory
for (const [a, b] of edges) { lists[a].push(b); lists[b].push(a); }
const listBytes = heapUsed() - before;

const matrix = new Uint8Array(V * V); // O(V^2) memory whatever the edge count
for (const [a, b] of edges) matrix[a * V + b] = matrix[b * V + a] = 1;

console.log(`V=${V} edges=${edges.length}  matrix: ${mb(matrix.byteLength)}  lists: ${mb(listBytes)}  (${lists.length} lists)`);
