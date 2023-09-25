import { FastifyRequest as Request, FastifyReply as Response } from 'fastify';
import prisma from "../configs/database";
import { IJwtPayload } from "../types/interfaces";
import { Author } from "@prisma/client";
import { STATUS as status, errorResponse as errResponse, verifyToken } from "../utils";

const authenticator = async (request: Request, reply: Response) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Invalid Token");
    }

    const payload: IJwtPayload = verifyToken(token);
    const author = await prisma.author.findUnique({
      where: {
        id: payload.authorId
      }
    }) as Author;

    if (!author) {
      throw new Error("Invalid Token");
    }

    request.author = author;
  } catch (error) {
    return errResponse(reply, status.UNAUTHORIZED, {}, "Unauthorized");
  }
};

export default authenticator;
