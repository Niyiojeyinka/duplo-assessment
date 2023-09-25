import { NextFunction, Request, Response } from "express";
import { AppError, isError, STATUS, successResponse }  from "../utils";
import * as postService from '../services/post-service';
import { IErrorResponse } from "../types/interfaces";
import { Post } from "@prisma/client";
import { getCache, setCache } from "../utils/cache";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, author } = req.body;

    const data : IErrorResponse | Post = await postService.createPost({
      title,
      content,
      author
    });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.CREATED, data);
  } catch (error) {
    next(error);
  }
}

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
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
  } catch (error) {
    next(error);
  }
}

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 10;
    const cachekey = `posts-${skip}-${take}`;
    let data = await getCache(cachekey);
    if (data) {
      return successResponse(res, STATUS.OK, data);
    }

    data = await postService.getPosts({ skip, take });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }

    await setCache(cachekey, data);

    return successResponse(res, STATUS.OK, data);
  } catch (error) {
    next(error);
  }
}

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const data : IErrorResponse | Post = await postService.updatePost(Number(id), {
      title,
      content,
      author
    });
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.OK, data);
  } catch (error) {
    next(error);
  }
}

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { author } = req.body;

    const data : IErrorResponse | string = await postService.deletePost(Number(id), author);
    if (isError(data)) {
      throw new AppError(data.error, STATUS.BAD_REQUEST);
    }
    
    return successResponse(res, STATUS.NO_CONTENT, {
      message: data
    });
  } catch (error) {
    next(error);
  }
}

export {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost
}
