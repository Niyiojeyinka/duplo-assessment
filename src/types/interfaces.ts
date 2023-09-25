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
export interface ICreatePost extends IContentAble {
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
