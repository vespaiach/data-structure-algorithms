// A trie of words: one node per distinct prefix, and each node maps the next character to a child.
// node trie.ts

export class TrieNode {
  children = new Map<string, TrieNode>();
  isWord = false; // a stored word ends here
  count = 0; // how many stored words start with the prefix that leads here
}

export class Trie {
  root = new TrieNode();

  // O(L) for a word of L characters. A word added twice is stored once.
  add(word: string): void {
    if (this.has(word)) return;
    let node = this.root;
    node.count++;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (next === undefined) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
      node.count++;
    }
    node.isWord = true;
  }

  // O(P) for a prefix of P characters, however many words are stored.
  countWithPrefix(prefix: string): number {
    let node = this.root;
    for (const ch of prefix) {
      const next = node.children.get(ch);
      if (next === undefined) return 0;
      node = next;
    }
    return node.count;
  }

  // O(L).
  has(word: string): boolean {
    let node: TrieNode | undefined = this.root;
    for (const ch of word) {
      node = node.children.get(ch);
      if (node === undefined) return false;
    }
    return node.isWord;
  }
}

if (process.argv[1] === import.meta.filename) {
  const t = new Trie();
  for (const cmd of ["deploy", "deploy-preview", "dev", "db-migrate", "db-seed", "dev"]) t.add(cmd);
  console.log("start with 'de':", t.countWithPrefix("de"), " 'db-':", t.countWithPrefix("db-"), " 'x':", t.countWithPrefix("x"), " '':", t.countWithPrefix(""));
  console.log("has 'dev':", t.has("dev"), " has 'de':", t.has("de"));
}
