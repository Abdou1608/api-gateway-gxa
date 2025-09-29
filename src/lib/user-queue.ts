const DEFAULT_CONCURRENCY = Number(process.env.USER_QUEUE_CONCURRENCY || '2') || 2;

type Limiter = <T>(fn: () => Promise<T> | T) => Promise<T>;

// Minimal per-key concurrency limiter (FIFO) to avoid ESM-only deps in tests
function createLimiter(concurrency: number): Limiter {
  let active = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    if (active >= concurrency) return;
    const run = queue.shift();
    if (!run) return;
    active++;
    run();
  };

  const limit: Limiter = async <T>(fn: () => Promise<T> | T) => {
    return new Promise<T>((resolve, reject) => {
      const exec = async () => {
        try {
          const res = await fn();
          resolve(res);
        } catch (e) {
          reject(e);
        } finally {
          active--;
          next();
        }
      };
      queue.push(exec);
      setImmediate(next);
    });
  };

  return limit;
}

const limiters = new Map<string, Limiter>();

function keyOf(userSub?: string, domain?: string): string {
  return `${userSub || 'anon'}::${domain || 'default'}`;
}

export function withUserQueue<T>(userSub: string | undefined, domain: string | undefined, task: () => Promise<T> | T): Promise<T> {
  const key = keyOf(userSub, domain);
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = createLimiter(DEFAULT_CONCURRENCY);
    limiters.set(key, limiter);
  }
  return limiter(task);
}

export function userQueueKey(userSub?: string, domain?: string) {
  return keyOf(userSub, domain);
}
