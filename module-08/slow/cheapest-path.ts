// A correct but slow answer to Exercise 3: Dijkstra with a scan for the closest cell, as in
// dijkstraScan. O((R * C)^2) time, O(R * C) memory.
export function cheapestPath(grid: string[]): number {
  const rows = grid.length, cols = rows > 0 ? grid[0].length : 0;
  if (rows === 0 || grid[0][0] === "#" || grid[rows - 1][cols - 1] === "#") return -1;
  const V = rows * cols;
  const dist = new Float64Array(V).fill(Infinity);
  const done = new Uint8Array(V);
  dist[0] = 0;
  for (let round = 0; round < V; round++) {
    let u = -1;
    for (let v = 0; v < V; v++) if (!done[v] && (u === -1 || dist[v] < dist[u])) u = v;
    if (dist[u] === Infinity) break;
    if (u === V - 1) return dist[u];
    done[u] = 1;
    const r = Math.floor(u / cols), c = u % cols;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] === "#") continue;
      const next = nr * cols + nc, nd = dist[u] + Number(grid[nr][nc]);
      if (nd < dist[next]) dist[next] = nd;
    }
  }
  return -1;
}
