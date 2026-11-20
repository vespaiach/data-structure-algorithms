// How deep can recursion go before V8 throws "Maximum call stack size exceeded"?
// Try: node stack-depth.ts, then node --stack-size=2000 stack-depth.ts (the size is in KB).
let depth = 0;

function small(): void {
  depth++;
  small();
}

// More parameters and live locals make each frame bigger, so fewer frames fit.
function big(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number): number {
  depth++;
  const x1 = a + b, x2 = c + d, x3 = e + f, x4 = g + h, x5 = x1 * x2, x6 = x3 * x4;
  return big(x1, x2, x3, x4, x5, x6, a, b) + x5 + x6;
}

function measure(label: string, run: () => unknown): void {
  depth = 0;
  try {
    run();
  } catch (err) {
    console.log(`${label.padEnd(38)} ${String(depth).padStart(7)} frames  ${(err as Error).constructor.name}: ${(err as Error).message}`);
  }
}

measure("small(), first call", small);
measure("small(), second call", small);
measure("big(8 params, 6 locals), first call", () => big(1, 2, 3, 4, 5, 6, 7, 8));

// The same function before and after the JIT has optimized it with many shallow calls.
function sum(n: number): number {
  depth++;
  if (n === 0) return 0;
  return sum(n - 1) + 1;
}
measure("sum(), cold", () => sum(1e9));
for (let i = 0; i < 200_000; i++) sum(20);
measure("sum(), after 200,000 shallow calls", () => sum(1e9));

// A call in tail position, in strict mode (modules are strict). ES2015 says it should not grow the stack.
function countDown(n: number): number {
  if (n === 0) return 0;
  depth++;
  return countDown(n - 1);
}
measure("countDown(1e6), a tail call", () => countDown(1_000_000));
