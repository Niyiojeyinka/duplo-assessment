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
}

  export interface IErrorResponse {
  error: string;
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

export interface PaginationArgs {
  skip?: number;
  take?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
}