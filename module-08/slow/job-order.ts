// A correct but slow answer to Exercise 2: scan every waiting job for the best one, then splice it out.
// O(n) per job, O(n^2) in all.
export type Job = { id: string; arrive: number; length: number };

export function jobOrder(jobs: Job[]): string[] {
  const byArrival = jobs.toSorted((a, b) => a.arrive - b.arrive);
  const waiting: Job[] = [];
  const order: string[] = [];
  let time = 0;
  let next = 0;
  while (order.length < jobs.length) {
    if (waiting.length === 0 && byArrival[next].arrive > time) time = byArrival[next].arrive;
    while (next < byArrival.length && byArrival[next].arrive <= time) waiting.push(byArrival[next++]);
    let best = 0;
    for (let i = 1; i < waiting.length; i++) {
      const a = waiting[i], b = waiting[best];
      if (a.length < b.length || (a.length === b.length && (a.arrive < b.arrive || (a.arrive === b.arrive && a.id < b.id)))) best = i;
    }
    const [job] = waiting.splice(best, 1);
    order.push(job.id);
    time += job.length;
  }
  return order;
}
