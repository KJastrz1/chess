import { AuthenticatedRequest } from '@src/types/express';
import {  User } from '../models/User';
import { Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';



export const protect: RequestHandler = async (req: any, res: Response, next: NextFunction) => {
  let token;
  if (req.cookies && req.cookies['jwtToken']) {
    try {
      token = req.cookies['jwtToken'];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

      const authReq = req as AuthenticatedRequest;
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      authReq.user = user;
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

export function handleAuthenticatedRequest<T extends AuthenticatedRequest>(
  controller: (req: T, res: Response) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    controller(req as T, res).catch(next);
  };
}
