import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import { AppError, STATUS, successResponse }  from "../utils";
import * as postService from '../services/post-service';
import { IPost, IResult, IPaginationResult } from "../types/interfaces";
import { Author } from "@prisma/client";
import { getCache, setCache } from "../utils/cache";
import { errorHandler } from "../utils/error-handler";

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body as IPost;
    const { author } = req;

    const result: IResult<IPost> = await postService.createPost({
      title,
      content,
      author
    });
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.BAD_REQUEST);
    }

    return successResponse(res, STATUS.CREATED, result.data as IPost);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
}

const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const cachekey = `post-${id}`;
    const data = await getCache(cachekey);

    if (data) {
      return successResponse(res, STATUS.OK, data as IPost);
    }

    const result: IResult<IPost> = await postService.getPost(Number(id));
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.NOT_FOUND);
    }

    await setCache(cachekey,result.data, 2); // 2 hour
    
    return successResponse(res, STATUS.OK, result.data as IPost);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
}

const getPosts = async (req: Request, res: Response) => {
  try {
    let {
      skip,
      take
    } = req.query as {
      skip: number | undefined;
      take: number | undefined;
    }

    skip = skip || 0;
    take = take || 10;

    const cachekey = `posts-${skip}-${take}`;
    const data = await getCache(cachekey);
    if (data) {
      return successResponse(res, STATUS.OK, data);
    }

    const result: IResult<IPaginationResult<IPost>> = await postService.getPosts({ skip, take });
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.BAD_REQUEST);
    }

    await setCache(cachekey, result.data, 2); // 2 hours

    return successResponse(res, STATUS.OK, result.data as IPaginationResult<IPost>);
  } catch (error: any) {
    return errorHandler(error, req, res);
  }
}

const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title, content } = req.body as IPost;
    const { author } = req;


    const result: IResult<IPost> = await postService.updatePost(Number(id), {
      title,
      content,
      author
    });
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.BAD_REQUEST);
    }

    return successResponse(res, STATUS.OK, result.data as IPost);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
}

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { author } = req;

    const result: IResult<object> = await postService.deletePost(Number(id), author as Author);
    if (!result.success) {
      throw new AppError(result.error as string, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.NO_CONTENT, result.data as object);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
}

export {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost
}
