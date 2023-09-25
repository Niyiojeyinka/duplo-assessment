import AppError from '../utils/app-error';
import logger from '../configs/logger';
import { errorResponse, STATUS } from '../utils';
import type { FastifyReply as Response, FastifyRequest as Request } from "fastify";

export const prismaErrorHandler = (error: any, entity: string) => {
  // ideally error will be mapped to a more readable error message also this will help with internationalization

  if (error.code === 'P2002') {
    return {
      error: `${entity} already exists`
    }
  }

  if (error.code === 'P2025') {
    return {
      error: `${entity} not found`
    }
  }
  
  logger.error(error.message);

  return {
    error: 'Error creating post'
  }
}

export const errorHandler = (error: Error, request: Request, reply: Response) => {
  logger.error(error);

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
      return errorResponse(reply, STATUS.INTERNAL_SERVER_ERROR, {}, 'Internal server error');
  }
}
