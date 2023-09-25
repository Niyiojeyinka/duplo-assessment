import { Response } from "express";

export const successResponse = (res: Response, status: number, data: object, message  : string  = "") => {
  return res.status(status).json({
    success: true,
    message,
    data
  })
}

export const errorResponse = (res: Response, status: number, data: any, message  : string  = "") => {
  let errors: [] = data?.errors


  return res.status(status).json({
    success: false,
    message,
    errors: errors || [{
      type: status > 500 ? "system" : "client",
      value: null,
      "msg": message,
      path: null,
      location: null
    }]
})
}
