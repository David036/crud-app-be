import { UserAuth } from '../entities/UserAuth';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../data_source';

const userRepository = AppDataSource.getRepository(UserAuth);
const secretKey = 'your-secret-key';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token as string;
  } else {
    return res.status(400).json({ error: 'Missing or invalid token' });
  }

  try {
    const isValidToken: any = jwt.verify(token, secretKey);

    if (isValidToken) {
      const { userId: id } = isValidToken;
      const userQuery = userRepository.createQueryBuilder('user');

      const currentUser = await userQuery
        .where('user.id = :id', { id })
        .getOne();

      if (currentUser) {
        req.body.currentUser = currentUser;
        return next();
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid token' });
    }
  } catch (decodeError: any) {
    return res.status(400).json({ error: decodeError.message });
  }
};
