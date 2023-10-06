import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import { AppError, STATUS, successResponse }  from "../utils";
import * as authorService from '../services/author-service';
import { IAuthor, IResult } from "../types/interfaces";
import { errorHandler } from '../utils/error-handler';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as IAuthor;

    const result : IResult<object> = await authorService.register({
      email: email as string,
      password: password as string,
      name: name as string
    });
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.CREATED, result.data as object);
      } catch (error : any) {
    return errorHandler(error, req, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const result : IResult<object> = await authorService.login(
      email,
      password
    );
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.BAD_REQUEST);
    }

    return successResponse(res, STATUS.OK, result.data as object);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
};
