// Exercise 3: returns the fewest single-character edits (insert a character, delete one, or
// replace one with another) that turn a into b. Use memory that grows with the shorter string,
// not with a.length * b.length.
// State: d(i, j) = the edits that turn a[0..i) into b[0..j). The last step deleted a[i - 1],
// inserted b[j - 1], or kept or replaced a[i - 1] with b[j - 1]:
// d(i, j) = min(d(i - 1, j) + 1, d(i, j - 1) + 1, d(i - 1, j - 1) + (a[i - 1] === b[j - 1] ? 0 : 1)).
// d(0, j) = j inserts, d(i, 0) = i deletes. Two rows, each as long as the shorter string.
// O(m * n) time, O(min(m, n)) memory.
export function editDistance(a: string, b: string): number {
  if (b.length > a.length) [a, b] = [b, a]; // the distance is the same both ways; make b the shorter
  let above = Array.from({ length: b.length + 1 }, (_, j) => j); // row 0: j inserts
  let row = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    row[0] = i; // i deletes
    for (let j = 1; j <= b.length; j++)
      row[j] = Math.min(above[j] + 1, row[j - 1] + 1, above[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    [above, row] = [row, above];
  }
  return above[b.length];
}
