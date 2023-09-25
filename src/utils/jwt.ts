import jwt, { JwtPayload } from 'jsonwebtoken';
import environmentConfig from '../configs/environment';
import { IJwtPayload } from '../types/interfaces';

const { JWT_SECRET } = environmentConfig;

export const generateToken = (payload: object, expiresIn: string = '1h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as IJwtPayload;
}
