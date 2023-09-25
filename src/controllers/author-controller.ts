import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import { AppError, isError, STATUS, successResponse }  from "../utils";
import * as authorService from '../services/author-service';
import { IErrorResponse, ILoginResponse, IAuthor } from "../types/interfaces";
import { errorHandler } from '../middlewares/errorHandler';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as IAuthor;

    const data : IErrorResponse | IAuthor = await authorService.register({
      email,
      password,
      name
    });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.CREATED, data);
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

    const data : IErrorResponse | ILoginResponse = await authorService.login(
      email,
      password
    );
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }

    return successResponse(res, STATUS.OK, data);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
};
