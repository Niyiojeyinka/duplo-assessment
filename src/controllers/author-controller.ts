import { NextFunction, Request, Response } from "express";
import { AppError, isError, STATUS, successResponse }  from "../utils";
import * as authorService from '../services/author-service';
import { IErrorResponse, ILoginResponse, IAuthor } from "../types/interfaces";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    const data : IErrorResponse | IAuthor = await authorService.register({
      email,
      password,
      name
    });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.CREATED, data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const data : IErrorResponse | ILoginResponse = await authorService.login(
      email,
      password
    );
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }

    return successResponse(res, STATUS.OK, data);
  } catch (error) {
    next(error);
  }
};
