import * as STATUS from './status-codes';

export default class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
