import prisma from "../configs/database";
import { IPost, IResult, IPaginationArgs, IPaginationResult  } from "../types/interfaces";
import { Author, Post } from "@prisma/client";
import { paginate } from "../utils/pagination";
import { prismaErrorHandler } from "../utils/error-handler";

const ENTITY_NAME = 'Post';
export const createPost = async (data: IPost ) : Promise<IResult<IPost>> => {
  const { title, content, author } = data;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      publishedAt: new Date(),
      author: {
        connect: {
          id: author?.id
        }
      },
    }
  });

  return {
    success: true,
    data: post
  }
}

export const getPost = async (id: number) : Promise<IResult<IPost>> => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return {
      success: false,
      error: 'Post not found'
    }
  }

  return {
    success: true,
    data: post
  }
}

export const getPosts = async (IPaginationArgs: IPaginationArgs): Promise<IResult<IPaginationResult<IPost>>> => {
  const data = await paginate<Post>({
    ...IPaginationArgs,
    count: async () => await prisma.post.count(),
    findMany: (args) => prisma.post.findMany({
      ...args,
      orderBy: { createdAt: 'desc' }
    })
  });

  return {
    success: true,
    data
  }
}

export const updatePost = async (id: number, data: IPost) : Promise<IResult<IPost>> => {
  try {
    const { title, content, author } = data;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return {
        success: false,
        error: 'Post not found'
      };
    }

    if (author?.id && post.authorId !== author.id) {
      return {
        success: false,
        error: 'Not authorized'
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        updatedAt: new Date()
      }
    });

    return {
      success: true,
      data: updatedPost
    };
  } catch (error: any) {
    return prismaErrorHandler(error, ENTITY_NAME);
  }
}


export const deletePost = async (id: number, author: Author) : Promise<IResult<object>> => {
try{
  await prisma.post.delete({ where: { id, authorId: author.id } });

  return {
    success: true,
    data: {
      message: 'Post deleted successfully'
    }
  };
  } catch (error: any) {
    return prismaErrorHandler(error, ENTITY_NAME);
  }
}

