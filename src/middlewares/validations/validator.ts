import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { STATUS, errorResponse } from '../../utils';

export const handleValidationErrors = (req : Request , res : Response, next : NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, STATUS.BAD_REQUEST, { errors: errors.array({ onlyFirstError: true })}, 'validation_error');
  }
  next();
};
