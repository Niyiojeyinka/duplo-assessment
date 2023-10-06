import logger from '../configs/logger';
import * as STATUS from './status-codes';
import type { FastifyReply as Response, FastifyRequest as Request } from "fastify";



export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const successResponse = (res: Response, status: number, data: object, message  : string  = "") => {
  return res.status(status).send({
    success: true,
    message,
    data
  })
}

export const errorResponse = (res: Response, status: number, data: any, message  : string  = "") => {
  let errors: [] = data?.errors

  return res.status(status).send({
    success: false,
    message,
    errors: errors || [{
      message,
    }]
  });
}

export const prismaErrorHandler = (error: any, entity: string) => {
  // ideally error will be mapped to a more readable error message also this will help with internationalization

  if (error.code === 'P2002') {
    return {
      success: false,
      error: `${entity} already exists`
    }
  }

  if (error.code === 'P2025') {
    return {
      success: false,
      error: `${entity} not found`
    }
  }
  
  logger.error(error.message);

  return {
    success: false,
    error: `Error occurred while processing ${entity}`
  }
}

export const errorHandler = (error: any, request: Request, reply: Response) => {
  if (error?.code === 'FST_ERR_VALIDATION') {
    return errorResponse(reply, STATUS.BAD_REQUEST, {}, error.message);
  }

  if (error instanceof AppError) {
    return errorResponse(reply, error.statusCode, {}, error.message);
  }

  switch (error?.name) {
    case 'ValidationError':
    case 'PrismaClientValidationError':
      return errorResponse(reply, STATUS.BAD_REQUEST, {}, error.message);
    
    case 'SyntaxError':
      return errorResponse(reply, STATUS.BAD_REQUEST, {}, 'Invalid JSON, please check your request body');
    
    default:
      logger.error(error.message);
      return errorResponse(reply, STATUS.INTERNAL_SERVER_ERROR, {}, 'Internal server error');
  }
}
