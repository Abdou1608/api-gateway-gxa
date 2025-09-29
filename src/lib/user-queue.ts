import pLimit from 'p-limit';

const DEFAULT_CONCURRENCY = Number(process.env.USER_QUEUE_CONCURRENCY || '2') || 2;

const limiters = new Map<string, ReturnType<typeof pLimit>>();

function keyOf(userSub?: string, domain?: string): string {
  return `${userSub || 'anon'}::${domain || 'default'}`;
}

export function withUserQueue<T>(userSub: string | undefined, domain: string | undefined, task: () => Promise<T> | T): Promise<T> {
  const key = keyOf(userSub, domain);
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = pLimit(DEFAULT_CONCURRENCY);
    limiters.set(key, limiter);
  }
  return limiter(task);
}

export function userQueueKey(userSub?: string, domain?: string) {
  return keyOf(userSub, domain);
}
