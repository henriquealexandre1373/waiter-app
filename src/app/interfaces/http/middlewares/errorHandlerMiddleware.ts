import { CustomError } from '@src/app/customTypes/CustomError';
import logger from '../../../services/loggerService';
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`${err.type || 'Unknown'} - ${err.message}`);
  if (err.stack) logger.error(err.stack);

  const baseError = {
    error: (err as { error?: string }).error,
    message: (err as { message?: string }).message,
  };

  let statusCode = 500;

  switch (err.type) {
    case 'RequiredResourceError':
      statusCode = 400;
      break;
    case 'TypeError':
      statusCode = 400;
      break;
    case 'DuplicatedResourceError':
      statusCode = 409;
      break;
    case 'NotFoundError':
      statusCode = 404;
      break;
    case 'DataBaseError':
      statusCode = 503;
      break;
    default:
      baseError.error = 'Unknown error';
      baseError.message = 'An unknown error has occurred';
  }

  res.status(statusCode).json({
    ...baseError,
  });

  next();
}
