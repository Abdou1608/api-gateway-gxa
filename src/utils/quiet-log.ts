
function isQuiet(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.E2E_QUIET === '1' || env.LOG_QUIET === '1';
}

export function quietLog(...args: unknown[]) {
  if (!isQuiet()) console.log(...args);
}

export function quietWarn(...args: unknown[]) {
  if (!isQuiet()) console.warn(...args);
}

export function quietError(...args: unknown[]) {
  if (!isQuiet()) console.error(...args);
}

