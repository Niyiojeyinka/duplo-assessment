import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import { AppError, isError, STATUS, successResponse }  from "../utils";
import * as postService from '../services/post-service';
import { IErrorResponse, IPost } from "../types/interfaces";
import { Author, Post } from "@prisma/client";
import { getCache, setCache } from "../utils/cache";
import { errorHandler } from "../middlewares/errorHandler";

const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body as IPost;
    const { author } = req;


    const data : IErrorResponse | Post = await postService.createPost({
      title,
      content,
      author
    });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.CREATED, data);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
}

const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const cachekey = `post-${id}`;
    let data : IErrorResponse | Post  = await getCache(cachekey);

    if (data) {
      return successResponse(res, STATUS.OK, data);
    }

    data = await postService.getPost(Number(id));
    if (isError(data)) {
      throw new AppError(data.error, STATUS.NOT_FOUND);
    }

    await setCache(cachekey, data);
    
    return successResponse(res, STATUS.OK, data);
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
    let data = await getCache(cachekey);
    if (data) {
      return successResponse(res, STATUS.OK, data);
    }

    data = await postService.getPosts({ skip, take });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }

    await setCache(cachekey, data, 2); // 2 hours

    return successResponse(res, STATUS.OK, data);
  } catch (error: any) {
    return errorHandler(error, req, res);
  }
}

const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title, content } = req.body as IPost;
    const { author } = req;


    const data : IErrorResponse | Post = await postService.updatePost(Number(id), {
      title,
      content,
      author
    });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.OK, data);
  } catch (error : any) {
    return errorHandler(error, req, res);
  }
}

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { author } = req;

    const data : IErrorResponse | string = await postService.deletePost(Number(id), author as Author);
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.NO_CONTENT, {
      message: data
    });
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
