import type { FastifyReply as Response } from "fastify";

export const successResponse = (res: Response, status: number, data: object, message  : string  = "") => {
  return res.status(status).send({
    success: true,
    message,
    data
  })
}

export const errorResponse = (res: Response, status: number, data: any, message  : string  = "") => {
  let errors: [] = data?.errors

  return res.status(status).send({
    success: false,
    message,
    errors: errors || [{
      message,
    }]
  });
}
