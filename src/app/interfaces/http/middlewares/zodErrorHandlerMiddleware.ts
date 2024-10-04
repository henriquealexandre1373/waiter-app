import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import logger from '@src/app/services/loggerService';

export function zodErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    formattedErrors.forEach((formattedError) =>
      logger.error(`Validation Error - ${formattedError.message}`)
    );

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: formattedErrors,
    });
  }

  return next(err);
}
