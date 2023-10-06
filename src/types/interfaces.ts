
import { Author } from "@prisma/client";

export interface ICreateAuthor {
  email: string;
  password?: string;
  name: string;
}

interface IContentAble {
  content: string;
  author?: Author;
}
export interface IPost extends IContentAble {
  title: string;
}

export interface IAuthor {
  id: number;
  email: string;
  name: string;
  password?: string;
}

export interface IJwtPayload {
  authorId: number;
}

export interface ILoginResponse {
  author: IAuthor;
  token: string;
}

export interface IPaginationData {
  totalItems: number;
  items: any[];
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
}

export interface IPaginationArgs {
  skip?: number;
  take?: number;
}

export interface IPaginationResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
}

declare module 'fastify' {
  interface FastifyRequest {
    author?: Author;
  }
}

export interface IResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
