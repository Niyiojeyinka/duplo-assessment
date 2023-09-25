import { NextFunction, Request, Response } from 'express';

export default (_req: Request, _res: Response, buf: Buffer, _encoding: any) => {
  try{
    JSON.parse(buf as unknown as string);
  } catch (e) {
    throw new SyntaxError('Invalid JSON');
  }
}
