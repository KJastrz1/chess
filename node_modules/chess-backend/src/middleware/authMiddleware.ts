import { User } from '@/models/User';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies && req.cookies['jwtToken']) {
        try {
            token = req.cookies['jwtToken'];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
            
            req.user = await User.findById(decoded._id).select('-password');
           
            if (!req.user) {              
                return res.status(404).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Unauthorized access, invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};
