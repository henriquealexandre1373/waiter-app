import { NextFunction, Request, Response } from 'express';

export type AsyncHandlerFn = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<Response | void>;
