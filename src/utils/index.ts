import AppError from "./app-error";
import * as STATUS from "./status-codes";
import { IErrorResponse } from "../types/interfaces";
import * as httpResponseHandler from "./http-response-handler"
import { verifyToken, generateToken } from "./jwt";

const isError = (response: IErrorResponse | any ): response is IErrorResponse => {
  return (response as IErrorResponse).error !== undefined;
}

const { successResponse, errorResponse } = httpResponseHandler;

export {
  isError,
  STATUS,
  AppError,
  successResponse,
  errorResponse,
  verifyToken,
  generateToken
}