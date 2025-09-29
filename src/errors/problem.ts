export interface ProblemDetails<T = any> {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  // Extensions
  [key: string]: any;
}

export function problem<T = any>(status: number, title?: string, detail?: string, ext?: T & Record<string, any>): ProblemDetails<T> {
  const base: ProblemDetails<T> = { status };
  if (title) base.title = title;
  if (detail) base.detail = detail;
  return Object.assign(base, ext || {});
}

export function toProblem(status: number, title?: string, detail?: string, ext?: Record<string, unknown>): ProblemDetails {
  return problem(status, title, detail, ext);
}
