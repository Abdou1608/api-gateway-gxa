import { NextFunction, Request, Response } from 'express';

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;

export function asyncHandler(fn: AsyncHandler) {
  return function wrapped(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
