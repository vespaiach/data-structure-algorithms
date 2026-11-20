// Practice 6: a log line lost its spaces. Returns true if line can be cut into a sequence of known
// words (each word can be used any number of times). Words are 1 to 20 characters long, and an
// empty line is a sequence of no words. Lines up to 100,000 characters, up to 1,000 words.
// Slow: backtracking (Module 10). Try every word that fits at the start, and recurse on the rest.
// Correct, but the same rest is tried again under every way of cutting the part before it:
// exponential time on a line that fails late. The recursion is as deep as the number of words cut.
export function canSplit(line: string, words: string[]): boolean {
  const explore = (start: number): boolean => {
    if (start === line.length) return true;
    for (const w of words) if (line.startsWith(w, start) && explore(start + w.length)) return true;
    return false;
  };
  return explore(0);
}
