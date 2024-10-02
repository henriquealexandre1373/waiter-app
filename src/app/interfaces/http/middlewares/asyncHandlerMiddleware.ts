import { AsyncHandlerFn } from '@src/app/customTypes/AsyncHandlerFn';
import { Request, Response, NextFunction } from 'express';

export const asyncHandler =
  (fn: AsyncHandlerFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
