import prisma from "../configs/database";
import { IErrorResponse, IPost, PaginationArgs  } from "../types/interfaces";
import { Author, Post } from "@prisma/client";
import { paginate } from "../utils/pagination";
import { prismaErrorHandler } from "../middlewares/errorHandler";

const ENTITY_NAME = 'Post';
export const createPost = async (data: IPost ) : Promise<IErrorResponse | Post > => {
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

  return post;
}

export const getPost = async (id: number) : Promise<IErrorResponse | Post> => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return {
      error: 'Post not found'
    }
  }

  return post;
}

export const getPosts = async (PaginationArgs: PaginationArgs) => {
  return paginate<Post>({
    ...PaginationArgs,
    count: async () => await prisma.post.count(),
    findMany: (args) => prisma.post.findMany({
      ...args,
      orderBy: { createdAt: 'desc' }
    })
  });
}

export const updatePost = async (id: number, data: IPost) : Promise<IErrorResponse | Post> => {
  try {
    const { title, content, author } = data;
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        updatedAt: new Date()
      }
    });

    if (author?.id && updatedPost.authorId !== author.id) {
      return {
        error: 'Not authorized'
      };
    }

    return updatedPost;

  } catch (error: any) {
    return prismaErrorHandler(error, ENTITY_NAME);
  }
}


export const deletePost = async (id: number, author: Author) : Promise<IErrorResponse | string> => {
try{
  await prisma.post.delete({ where: { id, authorId: author.id } });

  return "Post deleted";
  } catch (error: any) {
    return prismaErrorHandler(error, ENTITY_NAME);
  }
}

