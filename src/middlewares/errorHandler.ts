import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/app-error';
import logger from '../configs/logger';
import { errorResponse, STATUS } from '../utils';


const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, {}, err.message);
  }

  if (err.name === 'ValidationError') {
    return errorResponse(res, STATUS.BAD_REQUEST, {}, err.message);
  }

  if (err.name === 'PrismaClientValidationError') {
    return errorResponse(res, STATUS.BAD_REQUEST, {}, err.message);
  }

  if (err.name === 'SyntaxError') {
    return errorResponse(res, STATUS.BAD_REQUEST, {}, 'Invalid JSON, please check your request body');
  }

  return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, {}, 'Internal server error')
};

export default errorHandler;
