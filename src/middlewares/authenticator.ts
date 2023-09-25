import { NextFunction, Request, Response } from "express";
import { STATUS, errorResponse, verifyToken } from "../utils";
import prisma from "../configs/database";
import { IJwtPayload } from "../types/interfaces";
import { Author } from "@prisma/client";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw "Invalid Token";
    }

    const payload: IJwtPayload = verifyToken(token);
    const author = await prisma.author.findUnique({
      where: {
        id: payload.authorId
      }
    }) as Author;
    if (!author) {
      throw "Invalid Token";
    }

    req.body.author = author;
    next();
  }catch{
    return errorResponse(res, STATUS.UNAUTHORIZED, {}, "Unauthorized");
  }
}