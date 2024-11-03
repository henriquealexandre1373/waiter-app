import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@src/app/customTypes/CustomError';
import errorHandler from '@interfaces/http/middlewares/errorHandlerMiddleware';
import logger from '@services/loggerService';

jest.mock('@services/loggerService', () => ({
  error: jest.fn(),
}));

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();

    jest.clearAllMocks();
  });

  it('should handle unknown error with status 500', () => {
    const error: CustomError = {
      type: 'UnknownError',
      message: 'Some error occurred',
      error: 'Some error',
    };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unknown error',
      message: 'An unknown error has occurred',
    });
    expect(logger.error).toHaveBeenCalledWith(
      `${error.type} - ${error.message}`
    );
    expect(nextFunction).toHaveBeenCalled();
  });
});
