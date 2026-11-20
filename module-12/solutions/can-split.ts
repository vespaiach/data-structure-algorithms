// Practice 6: a log line lost its spaces. Returns true if line can be cut into a sequence of known
// words (each word can be used any number of times). Words are 1 to 20 characters long, and an
// empty line is a sequence of no words. Lines up to 100,000 characters, up to 1,000 words.
// Pattern: dynamic programming (Module 11) with a Set (Module 3). The state is a position: ok[i]
// says whether the first i characters can be cut into words. ok[i] is true when some word ends at
// i and ok is true where that word starts. Filled from i = 1 up, with no recursion, so a long
// line can't overflow the call stack. O(n * L) Set lookups for words up to L characters, each
// O(L) to cut and hash the piece: O(n * L^2) time, O(n) memory for ok plus the Set of words.
export function canSplit(line: string, words: string[]): boolean {
  const known = new Set(words);
  const longest = Math.max(0, ...words.map((w) => w.length));
  const ok = new Uint8Array(line.length + 1);
  ok[0] = 1; // the empty start
  for (let i = 1; i <= line.length; i++) {
    for (let len = 1; len <= Math.min(longest, i); len++) {
      if (ok[i - len] === 1 && known.has(line.slice(i - len, i))) {
        ok[i] = 1;
        break;
      }
    }
  }
  return ok[line.length] === 1;
}
